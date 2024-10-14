"use strict"

import { ObjectId } from "mongodb"
import { fetchAllUsers } from "@collections/users.js"

/**
 * Retrieve all users with optional filters and sorting.
 *
 * Query Parameters:
 *  - `sort` (optional): Sort the results based on the following options:
 *      - `"lastUpdated"`: Sort by the `updatedAt` field in descending order.
 *      - `"alphabetical"`: Sort by the `title` field in ascending order (alphabetically).
 *
 * Example API call:
 * GET /api/document/all?sort=alphabetical
 *
 * @async
 * @param {object} req - The request object, containing optional query parameters.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends an array of users matching the filters to the client.
 */
export const get = async (req, res) => {
    try {
        const filters = {}
        const { sort } = req.query

        // Construct sorting options based on query parameters
        const sortOptions = {}
        if (sort === "lastUpdated") sortOptions.updatedAt = -1 // Sort by last updated
        if (sort === "alphabetical") sortOptions.title = 1 // Sort alphabetically by title

        const users = await fetchAllUsers(filters, sortOptions)

        users.forEach((user) => {
            delete user.passwordHash
        })

        return res.status(200).json(users)
    } catch (e) {
        console.error("Error fetching users:", e)
        return res.status(500).send("Internal Server Error")
    }
}
