"use strict"

import { fetchUserByEmail } from "@collections/users.js"
import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve a single user from the database by its email.
 *
 * Request Body:
 *  - `email` (required): The email of the user to retrieve.
 *
 * Example API call:
 * POST /api/users/find
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const post = [
    adminJWT(),
    async (req, res) => {
        try {
            const { email } = req.body

            const exactMatch = req.body.exactMatch === "true"

            if (!email) return res.status(400).send("Missing email")

            const user = await fetchUserByEmail(email, exactMatch)

            if (!user)
                return res
                    .status(404)
                    .send(`No user found with email ${email}.`)

            delete user.passwordHash

            return res.status(200).json(user)
        } catch (err) {
            return res.status(500).send("Internal Server Error")
        }
    },
]
