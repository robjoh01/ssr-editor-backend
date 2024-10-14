"use strict"

import { fetchUserByEmail } from "@collections/users.js"

/**
 * Retrieve a single user from the database by its email.
 *
 * Request Body:
 *  - `email` (required): The email of the user to retrieve.
 *
 * Example API call:
 * GET /api/user/find
 *
 * @async
 * @param {object} req - The request object, containing the user email in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const get = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) return res.status(400).send("Missing email")

        const user = await fetchUserByEmail(email)

        if (!user)
            return res.status(404).send(`No user found with email ${email}.`)

        delete user.passwordHash

        return res.status(200).json(user)
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
