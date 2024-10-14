"use strict"

import { fetchUser, updateUser, removeUser } from "@collections/users.js"

/**
 * Retrieve a single user from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the user to retrieve.
 *
 * Example API call:
 * GET /api/user/:id
 *
 * @async
 * @param {object} req - The request object, containing the user ID in the params.
 * @param {object} res - The response object, used to send the user back to the client.
 * @returns {Promise<void>} Sends the user as a JSON response or an error message if not found.
 */
export const get = async (req, res) => {
    try {
        const { id } = req.params
        const user = await fetchUser(id)

        if (!user) return res.status(404).send(`No user found with ID ${id}.`)

        delete user.passwordHash

        return res.status(200).json(user)
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
