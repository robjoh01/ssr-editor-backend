"use strict"

import { ObjectId } from "mongodb"
import { checkUserExistsByID } from "@collections/users.js"

import adminJWT from "@middlewares/adminJWT.js"

/**
 * Retrieve a single user from the database by its email.
 *
 * Request Body:
 *  - `email` (required): The email of the user to retrieve.
 *
 * Example API call:
 * GET /api/users/find
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
            const { id } = req.body

            if (!id) return res.status(400).send("Missing user ID.")

            if (!ObjectId.isValid(id))
                return res.status(400).send("Invalid user ID.")

            const doesUserExist = await checkUserExistsByID(id)
            return res.status(200).json({ exists: doesUserExist })
        } catch (err) {
            return res.status(500).send("Internal Server Error")
        }
    },
]
