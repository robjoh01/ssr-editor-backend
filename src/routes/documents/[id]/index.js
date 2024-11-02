"use strict"

import { ObjectId } from "mongodb"

import {
    fetchDocument,
    updateDocument,
    removeDocument,
} from "@collections/documents.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve a single document from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to retrieve.
 *
 * Example API call:
 * GET /api/documents/:id
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the document as a JSON response or an error message if not found.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        const id = req.params.id

        if (!ObjectId.isValid(id))
            return res.status(400).send("Bad Request! Invalid document ID.")

        try {
            const doc = await fetchDocument(id)

            if (!doc)
                return res.status(404).send(`No document found with ID ${id}.`)

            return res.status(200).json(doc)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Update an existing document in the database.
 *
 * Request Headers:
 *  - accessToken (required): The access token of the user.
 *
 * Request Parameters:
 *  - id (required): The ID of the document to update.
 *
 * Request Body:
 *  - title (optional): The new title of the document.
 *  - content (optional): The new content of the document.
 *  - collaborators (optional): Updated list of collaborators.
 *  - stats (optional): Updated document statistics (totalEdits, totalViews, activeComments, activeUsers).
 *
 * Query Parameters:
 *  - returnValue (optional): If true, the updated document will be returned in the response.
 *
 * Example API call:
 * PUT /api/documents/:id?returnValue=true
 *
 * Request Body:
 * {
 *   "title": "Updated Title",
 *   "content": "Updated content",
 *   "ownerId": "66eae0bd0f6e02824705d72c",
 *   "collaborators": [],
 *   "stats": {
 *     "totalEdits": 5,
 *     "totalViews": 100,
 *     "activeComments": 2,
 *     "activeUsers": 3
 *   }
 * }
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message or an updated document based on the query parameter.
 */
export const put = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id)
            return res.status(400).send("Bad Request! Missing document ID.")

        if (!ObjectId.isValid(id))
            return res.status(400).send("Bad Request! Invalid document ID.")

        const returnValue = req.query.returnValue === "true"

        // Fetch the existing document
        try {
            const document = await fetchDocument(id)

            if (!document)
                return res.status(404).send(`Document with ID ${id} not found.`)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }

        const {
            title = null,
            content = null,
            collaborators = null,
            stats = null,
        } = req.body

        // Check if any properties are provided for update
        if (!title && !content && !collaborators && !stats) {
            return res.status(400).send("Bad Request! No properties to update.")
        }

        // Build the update object with only provided fields
        const updateProps = {}

        if (title) updateProps.title = title
        if (content) updateProps.content = content
        if (collaborators) updateProps.collaborators = collaborators
        if (stats) updateProps.stats = stats

        try {
            // Update the document in the database
            const result = await updateDocument(id, updateProps)

            if (!result.acknowledged)
                return res
                    .status(404)
                    .send(`No document found with ID ${id} to update.`)

            // If the client requested the updated document, return it
            if (returnValue) {
                const updatedDocument = await fetchDocument(id)
                return res.status(200).json(updatedDocument)
            }

            // Otherwise, return a success message
            return res
                .status(200)
                .send(`Document with ID ${id} was successfully updated.`)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Delete a document from the database by its ID.
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
 * @returns {Promise<void>} Sends a success message if the document was deleted, or an error message if not.
 */
export const del = [
    adminJWT(),
    async (req, res) => {
        const { id } = req.params

        if (!id)
            return res.status(400).send("Bad Request! Missing document ID.")

        if (!ObjectId.isValid(id))
            return res.status(400).send("Bad Request! Invalid document ID.")

        // Check if the document exists
        const document = await fetchDocument(id)

        if (!document)
            return res.status(404).send(`No document found with ID ${id}.`)

        try {
            const result = await removeDocument(id)

            if (result.acknowledged && result.deletedCount === 0)
                return res.status(404).send(`No document found with ID ${id}.`)

            if (result.acknowledged && result.deletedCount > 0)
                return res
                    .status(200)
                    .send(`Document with ID ${id} was successfully deleted.`)

            return res.status(500).send("Failed to delete the document.")
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
