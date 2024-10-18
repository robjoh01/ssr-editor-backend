"use strict"

import { fetchUser, updateUser } from "@collections/users.js"
import validator from "validator"
import authenticateJWT from "@middlewares/authenticateJWT.js"

import { fetchDocument } from "@collections/documents.js"
import { fetchComment } from "@/collections/comments.js"

/**
 * Get current user details in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Example API call:
 * GET /api/auth/details
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const get = [
    authenticateJWT(),
    async (req, res) => {
        const { user } = req
        try {
            const details = await fetchUser(user._id)

            // Check if user exists
            if (!details) {
                return res.status(404).json({ message: "User not found" })
            }

            // Remove the password hash from the response
            delete details.passwordHash

            // Fetch documents and their comments
            const documentsWithComments = await Promise.all(
                details.documents.map(async (documentId) => {
                    const document = await fetchDocument(documentId)

                    if (document) {
                        const comments = await Promise.all(
                            document.comments.map(async (commentId) => {
                                return await fetchComment(commentId)
                            })
                        )
                        return { ...document, comments } // Include comments in the document
                    }
                    return null // Return null if document not found
                })
            )

            // Filter out any null documents
            details.documents = documentsWithComments.filter(Boolean)

            return res.status(200).json(details)
        } catch (error) {
            console.error("Error fetching user details:", error)
            return res.status(500).json({ message: "Internal server error" })
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
 *
 * Example API call:
 * PUT /api/auth/details
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const put = [
    authenticateJWT(),
    async (req, res) => {
        const { user } = req

        if (!user) return res.status(401).send("Unauthorized")

        const returnValue = req.query.returnValue === "true"
        const { name, email, password } = req.body

        if (!name && !email && !password)
            return res
                .status(400)
                .send("Bad Request! Missing required parameters.")

        if (email && !validator.isEmail(email))
            return res.status(400).send("Bad Request! Invalid email format.")

        if (password && !validator.isStrongPassword(password))
            return res.status(400).send("Bad Request! Invalid password format.")

        try {
            const updatedUser = await updateUser(user._id, {
                name,
                email,
                password,
            })

            if (!updatedUser)
                return res
                    .status(404)
                    .send(`No user found with ID ${user._id} to update.`)

            if (returnValue) {
                const newUserDetails = await fetchUser(user._id)
                return res.status(200).json(newUserDetails)
            }

            return res.status(200).json({
                message: `User with ID ${user._id} was successfully updated.`,
            })
        } catch (e) {
            console.error("Error updating user:", e)
            return res
                .status(500)
                .send("Internal Server Error while updating user.")
        }
    },
]
