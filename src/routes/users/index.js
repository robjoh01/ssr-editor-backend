"use strict"

import { createUser, fetchUser, fetchAllUsers } from "@collections/users.js"
import { hashPassword } from "@utils/crypt.js"

import adminJWT from "@middlewares/adminJWT.js"
import validator from "validator"

/**
 * Retrieve all users with optional filters and sorting.
 *
 * Query Parameters:
 *  - `sort` (optional): Sort the results based on the following options:
 *      - `"lastUpdated"`: Sort by the `updatedAt` field in descending order.
 *      - `"alphabetical"`: Sort by the `title` field in ascending order (alphabetically).
 *
 * Example API call:
 * GET /api/users?sort=alphabetical
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends an array of users matching the filters to the client.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
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
    },
]

/**
 * Create a new user in the database.
 *
 * Request Headers:
 *  - `accessToken` (required): The access token of the user.
 *
 * Request Body:
 *  - `name` (required): Name of the user.
 *  - `email` (required): Email of the user.
 *  - `password` (required): Password of the user.
 *  - `stats` (optional): The stats of the user including totalEdits, totalComments, and totalDocuments.
 *  - `profilePicture` (optional): A URL to the profile picture of the user.
 *
 * Example API call:
 * POST /api/users
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the created user as a JSON response or an error message if not created.
 */
export const post = [
    adminJWT(),
    async (req, res) => {
        try {
            const {
                isAdmin,
                name,
                email,
                password,
                stats = {},
                profilePicture = "",
            } = req.body

            // Validate required parameters
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .send("Bad Request! Missing required parameters.")
            }

            if (!validator.isEmail(email))
                return res
                    .status(400)
                    .send("Bad Request! Invalid email format.")

            if (!validator.isStrongPassword(password))
                return res
                    .status(400)
                    .send("Bad Request! Invalid password format.")

            const hashedPassword = await hashPassword(password)

            // Prepare user with default stats if not provided
            const user = {
                isAdmin,
                name,
                email,
                passwordHash: hashedPassword,
                stats: {
                    totalEdits: stats.totalEdits || 0,
                    totalComments: stats.totalComments || 0,
                    totalDocuments: stats.totalDocuments || 0,
                },
                profilePicture,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            }

            // Call the create function with the user data
            const result = await createUser(user)

            if (!result.acknowledged)
                return res.status(500).send("Internal Server Error")

            const createdUser = await fetchUser(result.insertedId)
            return res.status(201).json(createdUser)
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
