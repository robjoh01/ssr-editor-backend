"use strict"

import { fetchUser, updateUser, removeUser } from "@collections/users.js"
import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve a single user from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the user to retrieve.
 *
 * Example API call:
 * GET /api/users/:id
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const { id } = req.params
            const user = await fetchUser(id)

            if (!user)
                return res.status(404).send(`No user found with ID ${id}.`)

            delete user.passwordHash

            return res.status(200).json(user)
        } catch (e) {
            console.error(e)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Update an existing comment in the database.
 *
 * Request Headers:
 *  - accessToken (required): The access token of the user.
 *
 * Request Parameters:
 *  - id (required): The ID of the user to update.
 *
 * Request Body:
 *  - content (required): The new content of the user.
 *
 * Query Parameters:
 *  - returnValue (optional): If true, the updated user will be returned in the response.
 *
 * Example API call:
 * PUT /api/users/:id?returnValue=true
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params and the update data in the body.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends a success message or an updated user based on the query parameter.
 */
export const put = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id) return res.status(400).send("Bad Request! Missing user ID.")

        const returnValue = req.query.returnValue === "true"

        // Fetch the existing user
        try {
            const user = await fetchUser(id)

            if (!user)
                return res.status(404).send(`User with ID ${id} not found.`)

            // Check if the user is the owner of the user
            if (user._id.toString() !== user.userId.toString())
                return res.status(403).send("Forbidden! You are not the owner.")
        } catch (e) {
            console.error("Error fetching user:", e)
            return res
                .status(500)
                .send("Internal Server Error while fetching user.")
        }

        const { content = null } = req.body

        if (!content)
            return res.status(400).send("Bad Request! Missing update data.")

        try {
            // Update the user in the database
            const updateResult = await updateUser(id, content)
            if (!updateResult)
                return res
                    .status(404)
                    .send(`No user found with ID ${id} to update.`)

            // If the client requested the updated user, return it
            if (returnValue) {
                const updatedUser = await fetchUser(id)
                return res.status(200).json(updatedUser)
            }

            // Otherwise, return a success message
            return res.status(200).json({
                message: `User with ID ${id} was successfully updated.`,
            })
        } catch (e) {
            console.error("Error updating user:", e)
            return res
                .status(500)
                .send("Internal Server Error while updating user.")
        }
    },
]

/**
 * Delete a user from the database by its ID.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the user to delete.
 *
 * Example API call:
 * DELETE /api/users/:id
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the user was deleted, or an error message if not.
 */
export const del = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id) return res.status(400).send("Bad Request! Missing user ID.")

        // Check if the user exists
        const user = await fetchUser(id)

        if (!user) return res.status(404).send(`No user found with ID ${id}.`)

        try {
            const result = await removeUser(id)

            if (result.acknowledged && result.deletedCount === 0)
                return res.status(404).send(`No user found with ID ${id}.`)

            if (result.acknowledged && result.deletedCount > 0)
                return res
                    .status(200)
                    .send(`User with ID ${id} was successfully deleted.`)

            return res.status(500).send("Failed to delete the user.")
        } catch (e) {
            console.error(e)
            return res.status(500).send("Internal Server Error")
        }
    },
]
