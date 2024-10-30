"use strict"

import { ObjectId } from "mongodb"
import {
    createComment,
    fetchComment,
    fetchAllComments,
} from "@collections/comments.js"

import { validateCommentPosition } from "@utils/regex.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve all comments.
 *
 * Example API call:
 * GET /api/comments
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the comments as a JSON response.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const comments = await fetchAllComments()
            return res.status(200).json(comments)
        } catch (e) {
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Create a new comment in the database.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
 *
 * Request Body:
 *  - `position` (required): The position of the comment in the document.
 *  - `content` (required): The content of the document.
 *  - `documentId` (required): The ID of the document to associate with the comment.
 *
 * Example API call:
 * POST /api/comments
 *
 * @async
 * @param {object} req - The request object containing the comment details in the body.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends the created comment as a JSON response or an error message if not created.
 */
export const post = [
    adminJWT(),
    async (req, res) => {
        const { user } = req

        try {
            const { position, content, documentId } = req.body

            // Validate required parameters
            if (!position || !content || !documentId) {
                return res
                    .status(400)
                    .send("Bad Request! Missing required parameters.")
            }

            if (!validateCommentPosition(position))
                return res
                    .status(400)
                    .send("Bad Request! Invalid position format.")

            if (!ObjectId.isValid(documentId))
                return res
                    .status(400)
                    .send("Bad Request! Invalid documentId format.")

            // Prepare comment with default stats if not provided
            const comment = {
                position,
                content,
                documentId: new ObjectId(documentId),
                userId: new ObjectId(user._id),
                resolved: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            // Call the create function with the comment data
            const result = await createComment(comment)

            if (!result.acknowledged)
                return res.status(500).send("Failed to create the comment.")

            const createdDoc = await fetchComment(result.insertedId)
            return res.status(201).json(createdDoc)
        } catch (err) {
            return res.status(500).send("Internal Server Error")
        }
    },
]
