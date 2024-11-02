"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"
import { fetchDocument } from "@collections/documents.js"

import authenticateJWT from "@middlewares/authenticateJWT.js"

/**
 * Delete a document.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to delete.
 *
 * Example API call:
 * DELETE /api/documents/:id
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message or an error message if not deleted.
 */
export const del = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params

        if (!ObjectId.isValid(documentId))
            return res
                .status(400)
                .send("Bad Request! Invalid documentId format.")

        const document = await fetchDocument(documentId)

        if (!document)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

        if (!document.ownerId.equals(user._id))
            return res.status(403).send("Forbidden! You are not the owner.")

        const { db } = await getDb()

        try {
            const result = await db
                .collection("documents")
                .deleteOne({ _id: new ObjectId(documentId) })

            if (!result.acknowledged)
                return res.status(500).send("Internal Server Error")

            if (result.acknowledged && result.deletedCount === 0)
                return res
                    .status(404)
                    .send(`Document with ID ${documentId} not found.`)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }

        return res
            .status(200)
            .send(`Document with ID ${documentId} was successfully deleted.`)
    },
]
