"use strict"

import authenticateJWT from "@middlewares/authenticateJWT.js"
import validator from "validator"

import { fetchUser, updateUser, removeUser } from "@collections/users.js"
import { sendEmailWithTemplate } from "@/utils/email.js"

/**
 * Get current user details in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Example API call:
 * GET /api/auth/user
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const get = [
    authenticateJWT(),
    async (req, res) => {
        const { user, accessToken } = req
        try {
            const details = await fetchUser(user._id)

            // Check if user exists
            if (!details) {
                return res.status(404).send("User not found")
            }

            // Remove the password hash from the response
            delete details.passwordHash

            return res.status(200).json({
                user: details,
                accessToken,
            })
        } catch (error) {
            console.error("Error fetching user details:", error)
            return res.status(500).send("Internal server error")
        }
    },
]

/**
 * Update current user in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Request Body:
 *  - name (optional): The new name of the user.
 *  - email (optional): The new email of the user.
 *  - password (optional): The new password of the user.
 *  - profilePicture (optional): The new profile picture of the user.
 *  - stats (optional): The new stats of the user including totalEdits, totalComments, and totalDocuments.
 *  - returnValue (optional): If true, the updated user will be returned in the response.
 *
 * Example API call:
 * PUT /api/auth/user
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>} Sends the updated user as a JSON response or an error message if not found.
 */
export const put = [
    authenticateJWT(),
    async (req, res) => {
        const { user } = req

        const returnValue = req.query.returnValue === "true"
        const {
            name = null,
            email = null,
            password = null,
            stats = null,
            profilePicture = null,
        } = req.body

        if (!name && !email && !password && !stats && !profilePicture)
            return res.status(400).send("Bad Request! Missing update data.")

        if (email && !validator.isEmail(email))
            return res.status(400).send("Bad Request! Invalid email.")

        if (password && !validator.isStrongPassword(password))
            return res.status(400).send("Bad Request! Invalid password.")

        try {
            const updatedUser = await updateUser(user._id, {
                name,
                email,
                password,
                stats,
                profilePicture,
            })

            if (!updatedUser)
                return res
                    .status(404)
                    .send(`No user found with ID ${user._id} to update.`)

            await sendEmailWithTemplate(
                [user.email],
                "Account Updated",
                "templates/account/updated.ejs",
                {
                    recipientName: user.name || user.email,
                }
            )

            if (returnValue) {
                const newUserDetails = await fetchUser(user._id)
                return res.status(200).json(newUserDetails)
            }

            return res
                .status(200)
                .json(`User with ID ${user._id} was successfully updated.`)
        } catch (e) {
            console.error("Error updating user:", e)
            return res
                .status(500)
                .send("Internal Server Error while updating user.")
        }
    },
]

/**
 * Delete current user in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Request Body:
 *  - returnValue (optional): If true, the deleted user will be returned in the response.
 *
 * Example API call:
 * DELETE /api/auth/user
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>}
 */
export const del = [
    authenticateJWT(),
    async (req, res) => {
        const { user } = req

        if (user.isAdmin)
            return res.status(403).send("Cannot delete admin user.")

        try {
            const deletedUser = await removeUser(user._id)

            if (!deletedUser)
                return res
                    .status(404)
                    .send(`User with ID ${user._id} not found.`)

            await sendEmailWithTemplate(
                [user.email],
                "Account deleted",
                "templates/account/deleted.ejs",
                {
                    recipientName: user.name || user.email,
                }
            )

            return res
                .status(200)
                .json(`User with ID ${user._id} was successfully deleted.`)
        } catch (e) {
            console.error("Error deleting user:", e)
            return res
                .status(500)
                .send("Internal Server Error while deleting user.")
        }
    },
]
