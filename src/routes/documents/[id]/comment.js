"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"
import { fetchDocument } from "@collections/documents.js"

import authenticateJWT from "@middlewares/authenticateJWT.js"

/**
 * Create a new comment on a document.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to comment on.
 *
 * Request Body:
 *  - `position` (required): The position of the comment in the document.
 *  - `content` (required): The content of the document.
 *
 * Example API call:
 * POST /api/documents/:id/comment
 *
 * @async
 * @param {object} req - The request object containing the comment details in the body.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends the created comment as a JSON response or an error message if not created.
 */
export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params
        const { position, content } = req.body

        if (!ObjectId.isValid(documentId))
            return res
                .status(400)
                .send("Bad Request! Invalid documentId format.")

        if (!position || !content)
            return res.status(400).send("Bad Request! Missing parameters.")

        const document = await fetchDocument(documentId)

        if (!document)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

        const { db } = await getDb()

        try {
            const result = await db.collection("comments").insertOne({
                position,
                content,
                resolved: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                documentId: new ObjectId(documentId),
                userId: new ObjectId(user._id),
            })

            if (!result.acknowledged)
                return res.status(500).send("Failed to create the comment.")
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        } finally {
            await db.client.close()
        }

        return res.status(201).send("Comment created.")
    },
]
