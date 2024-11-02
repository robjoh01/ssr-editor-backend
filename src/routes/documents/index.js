"use strict"

import { ObjectId } from "mongodb"

import {
    createDocument,
    fetchDocument,
    fetchAllDocuments,
} from "@collections/documents.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve all documents.
 *
 * Example API call:
 * GET /api/documents
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the documents as a JSON response.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const documents = await fetchAllDocuments()
            return res.status(200).json(documents)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Create a new document in the database.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
 *
 * Request Body:
 *  - `title` (required): The title of the document.
 *  - `content` (optional): The content of the document.
 *  - `collaborators` (optional): List of collaborators associated with the document.
 *  - `comments` (optional): List of comments for the document.
 *  - `stats` (optional): Document statistics such as totalEdits, totalViews, activeComments, and activeUsers.
 *
 * Example API call:
 * POST /api/documents
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the created document or an error message back to the client.
 */
export const post = [
    adminJWT(),
    async (req, res) => {
        const { user } = req

        const {
            title,
            content = "",
            collaborators = [],
            comments = [],
            stats = {},
        } = req.body

        // Validate required parameters
        if (!title) {
            return res.status(400).send("Bad Request! Missing required title.")
        }

        // Prepare document with default stats if not provided
        const document = {
            title,
            content,
            ownerId: new ObjectId(user._id),
            collaborators,
            comments,
            stats: {
                totalEdits: stats.totalEdits || 0,
                totalViews: stats.totalViews || 0,
                activeComments: stats.activeComments || 0,
                activeUsers: stats.activeUsers || 0,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        try {
            // Call the create function with the document data
            const result = await createDocument(document)

            if (!result.acknowledged)
                return res.status(500).send("Failed to create the document.")

            const createdDoc = await fetchDocument(result.insertedId)
            return res.status(201).json(createdDoc)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
