"use strict"

import { fetchAllDocuments } from "@/collections/documents.js"

/**
 * Retrieve all documents with optional filters and sorting.
 *
 * Query Parameters:
 *  - `userId` (optional): Filter by either the `ownerId` or the `collaboratorId`.
 *  - `grant` (optional): Comma-separated list of grants (e.g., "read,write"). Filters documents where the specified collaborator has *all* of the listed grants.
 *  - `title` (optional): Search for documents with a title that matches the provided string (case-insensitive).
 *  - `totalViews` (optional): Filter by the total number of views (exact match).
 *  - `activeUsers` (optional): Filter by the number of active users on a document (exact match).
 *  - `sort` (optional): Sort the results based on the following options:
 *      - `"lastUpdated"`: Sort by the `updatedAt` field in descending order.
 *      - `"alphabetical"`: Sort by the `title` field in ascending order (alphabetically).
 *
 * Example API call:
 * GET /api/documents?userId=123&title=Lorem&collaboratorId=456&collaboratorGrant=read,write&sort=alphabetical
 *
 * @async
 * @param {object} req - The request object, containing optional query parameters.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends an array of documents matching the filters to the client.
 */
export const get = async (req, res) => {
    try {
        const { userId, title, totalViews, activeUsers, grants, sort } =
            req.query

        // Construct filters based on query parameters
        const filters = {}
        const orConditions = []

        // Filter for documents owned by the user
        if (userId) {
            orConditions.push({ ownerId: userId }) // Filter by owner ID
        }

        // Filter for documents that the user has access to, based on grants
        if (userId && grants) {
            // Split the grants string into an array if it's provided
            const grantArray = Array.isArray(grants)
                ? grants
                : grants.split(",").map((g) => g.trim())

            // Add collaborator filter if grants exist
            orConditions.push({
                collaborators: {
                    $elemMatch: {
                        userId: userId,
                        grant: { $all: grantArray }, // Use grants to filter
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
        if (totalViews) filters["stats.totalViews"] = parseInt(totalViews, 10) // Filter by total views
        if (activeUsers)
            filters["stats.activeUsers"] = parseInt(activeUsers, 10) // Filter by active users

        // Construct sorting options based on query parameters
        const sortOptions = {}
        if (sort === "lastUpdated") sortOptions.updatedAt = -1 // Sort by last updated
        if (sort === "alphabetical") sortOptions.title = 1 // Sort alphabetically by title

        const docs = await fetchAllDocuments(filters, sortOptions)
        return res.status(200).json(docs)
    } catch (e) {
        console.error("Error fetching documents:", e)
        return res.status(500).send("Internal Server Error")
    }
}
