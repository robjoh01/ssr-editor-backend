"use strict"

import { createDocument } from "@/collections/documents.js"

/**
 * Create a new document in the database.
 *
 * Request Body:
 *  - `title` (required): The title of the document.
 *  - `content` (required): The content of the document.
 *  - `ownerId` (required): The ID of the document owner.
 *  - `collaborators` (optional): List of collaborators associated with the document.
 *  - `comments` (optional): List of comments for the document.
 *  - `stats` (optional): Document statistics such as totalEdits, totalViews, activeComments, and activeUsers.
 *
 * Example API call:
 * POST /api/documents
 *
 * Request Body:
 * {
 *   "title": "New Document",
 *   "content": "This is the content of the document",
 *   "ownerId": "66eae0bd0f6e02824705d72c",
 *   "collaborators": [],
 *   "comments": [],
 *   "stats": {
 *     "totalEdits": 0,
 *     "totalViews": 0,
 *     "activeComments": 0,
 *     "activeUsers": 0
 *   }
 * }
 *
 * @async
 * @param {object} req - The request object containing the document details in the body.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends the created document or an error message back to the client.
 */

export const post = async (req, res) => {
    try {
        const {
            title,
            content,
            ownerId,
            collaborators = [],
            comments = [],
            stats = {},
        } = req.body

        // Validate required parameters
        if (!title || !content || !ownerId) {
            return res
                .status(400)
                .send(
                    "Bad Request! Missing required title, content, or ownerId."
                )
        }

        // Prepare document with default stats if not provided
        const document = {
            title,
            content,
            ownerId: new ObjectId(ownerId),
            collaborators,
            comments,
            stats: {
                totalEdits: stats.totalEdits || 0,
                totalViews: stats.totalViews || 0,
                activeComments: stats.activeComments || 0,
                activeUsers: stats.activeUsers || 0,
            },
            createdAt: new Date(),
            updatedAt: null,
        }

        // Call the create function with the document data
        const result = await createDocument(document)

        // Check if the document was successfully created
        if (result.acknowledged) {
            // Retrieve the created document using the insertedId
            const createdDoc = await documents.fetch(result.insertedId)
            return res.status(201).json(createdDoc)
        } else {
            return res
                .status(500)
                .send("Internal Server Error: Document not created.")
        }
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
