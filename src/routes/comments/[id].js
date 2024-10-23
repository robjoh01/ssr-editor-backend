"use strict"

import {
    fetchComment,
    updateComment,
    removeComment,
} from "@collections/comments.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve a single comment from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the comment to retrieve.
 *
 * Example API call:
 * GET /api/comments/:id
 *
 * @async
 * @param {object} req - The request object, containing the comment ID in the params.
 * @param {object} res - The response object, used to send the comment back to the client.
 * @returns {Promise<void>} Sends the comment as a JSON response or an error message if not found.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const id = req.params.id
            const doc = await fetchComment(id)

            if (!doc)
                return res.status(404).send(`No comment found with ID ${id}.`)

            return res.status(200).json(doc)
        } catch (err) {
            console.error(err)
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
 *  - id (required): The ID of the comment to update.
 *
 * Request Body:
 *  - content (required): The new content of the comment.
 *
 * Query Parameters:
 *  - returnValue (optional): If true, the updated comment will be returned in the response.
 *
 * Example API call:
 * PUT /api/comments/:id?returnValue=true
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message or an updated comment based on the query parameter.
 */
export const put = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id) return res.status(400).send("Bad Request! Missing comment ID.")

        const comment = await fetchComment(id)

        if (!comment)
            return res.status(404).send(`Comment with ID ${id} not found.`)

        const returnValue = req.query.returnValue === "true"

        const { content = null } = req.body

        if (!content)
            return res.status(400).send("Bad Request! Missing update data.")

        try {
            // Update the comment in the database
            const updateResult = await updateComment(id, content)
            if (!updateResult)
                return res
                    .status(404)
                    .send(`No comment found with ID ${id} to update.`)

            // If the client requested the updated comment, return it
            if (returnValue) {
                const updatedComment = await fetchComment(id)
                return res.status(200).json(updatedComment)
            }

            // Otherwise, return a success message
            return res
                .status(200)
                .send(`Comment with ID ${id} was successfully updated.`)
        } catch (e) {
            console.error("Error updating comment:", e)
            return res
                .status(500)
                .send("Internal Server Error while updating comment.")
        }
    },
]

/**
 * Delete a comment from the database by its ID.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the comment to delete.
 *
 * Example API call:
 * DELETE /api/comments/:id
 *
 * @async
 * @param {object} req - The request object, containing the comment ID in the params.
 * @param {object} res - The response object, used to send the result of the deletion back to the client.
 * @returns {Promise<void>} Sends a success message if the comment was deleted, or an error message if not.
 */
export const del = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id) return res.status(400).send("Bad Request! Missing comment ID.")

        // Check if the comment exists
        const comment = await fetchComment(id)

        if (!comment)
            return res.status(404).send(`No comment found with ID ${id}.`)

        try {
            const result = await removeComment(id)

            if (result.acknowledged && result.deletedCount === 0)
                return res.status(404).send(`No comment found with ID ${id}.`)

            if (result.acknowledged && result.deletedCount > 0)
                return res
                    .status(200)
                    .send(`Comment with ID ${id} was successfully deleted.`)

            return res.status(500).send("Failed to delete the comment.")
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
