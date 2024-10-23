"use strict"

import { ObjectId } from "mongodb"

import {
    createDocument,
    fetchDocument,
    fetchAllDocuments,
} from "@/collections/documents.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve all documents with optional filters and sorting.
 *
 * Query Parameters:
 *  - `userId` (optional): Filter by either the `ownerId` or the `collaboratorId`.
 *  - `canWrite` (optional): Filter by whether the user can write to the document.
 *  - `title` (optional): Search for documents with a title that matches the provided string (case-insensitive).
 *  - `totalViews` (optional): Filter by the total number of views (exact match).
 *  - `activeUsers` (optional): Filter by the number of active users on a document (exact match).
 *  - `sort` (optional): Sort the results based on the following options:
 *      - `"lastUpdated"`: Sort by the `updatedAt` field in descending order.
 *      - `"alphabetical"`: Sort by the `title` field in ascending order (alphabetically).
 *
 * Example API call:
 * GET /api/documents?userId=123&title=Lorem&collaboratorId=456&canWrite=true&sort=alphabetical
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends an array of documents matching the filters to the client.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const { userId, title, totalViews, activeUsers, canWrite, sort } =
                req.query

            // Construct filters based on query parameters
            const filters = {}
            const orConditions = []

            // Filter for documents owned by the user
            if (userId) {
                orConditions.push({ ownerId: new ObjectId(userId) }) // Filter by owner ID
            }

            // Filter for documents that the user has access to
            if (userId && canWrite) {
                orConditions.push({
                    collaborators: {
                        $elemMatch: {
                            userId: new ObjectId(userId),
                            canWrite,
                        },
                    },
                })
            }

            // If any or conditions exist, use them in the filters
            if (orConditions.length > 0) {
                filters.$or = orConditions
            }

            // Other filters
            if (title) filters.title = { $regex: title, $options: "i" } // Case-insensitive match for title
            if (totalViews)
                filters["stats.totalViews"] = parseInt(totalViews, 10) // Filter by total views
            if (activeUsers)
                filters["stats.activeUsers"] = parseInt(activeUsers, 10) // Filter by active users

            // Construct sorting options based on query parameters
            const sortOptions = {}
            if (sort === "lastUpdated") sortOptions.updatedAt = -1 // Sort by last updated
            if (sort === "alphabetical") sortOptions.title = 1 // Sort alphabetically by title

            const documents = await fetchAllDocuments(filters, sortOptions)
            return res.status(200).json(documents)
        } catch (e) {
            console.error("Error fetching documents:", e)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Create a new document in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
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

        try {
            const {
                title,
                content = "",
                collaborators = [],
                comments = [],
                stats = {},
            } = req.body

            // Validate required parameters
            if (!title) {
                return res
                    .status(400)
                    .send("Bad Request! Missing required title.")
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

            // Call the create function with the document data
            const result = await createDocument(document)

            if (!result.acknowledged)
                return res.status(500).send("Failed to create the document.")

            const createdDoc = await fetchDocument(result.insertedId)
            return res.status(201).json(createdDoc)
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
