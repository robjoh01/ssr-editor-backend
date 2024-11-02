"use strict"

import { createUser, fetchUser, fetchAllUsers } from "@collections/users.js"
import { hashPassword } from "@utils/crypt.js"

import adminJWT from "@middlewares/adminJWT.js"
import validator from "validator"

/**
 * Retrieve all users.
 *
 * Example API call:
 * GET /api/users
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the users as a JSON response.
 */
export const get = [
    adminJWT(),
    async (req, res) => {
        try {
            const users = await fetchAllUsers()

            users.forEach((user) => {
                delete user.passwordHash
            })

            return res.status(200).json(users)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]

/**
 * Create a new user in the database.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
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
            return res.status(400).send("Bad Request! Invalid email format.")

        if (!validator.isStrongPassword(password))
            return res.status(400).send("Bad Request! Not a strong password.")

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

        try {
            // Call the create function with the user data
            const result = await createUser(user)

            if (!result.acknowledged)
                return res.status(500).send("Internal Server Error")

            const createdUser = await fetchUser(result.insertedId)
            return res.status(201).json(createdUser)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
    },
]
