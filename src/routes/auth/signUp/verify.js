"use strict"

import { getDb } from "@utils/database.js"
import { verifyAccountToken } from "@utils/token.js"

import validator from "validator"

/**
 * Verify an account.
 *
 * Example API call:
 * POST /api/auth/signUp/verify
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the user was created, or an error message if not.
 */
export const post = async (req, res) => {
    const { token } = req.body

    if (!token) return res.status(400).send("Token is required")

    // Verify token
    const decodedToken = await verifyAccountToken(token)

    if (!decodedToken) return res.status(400).send("Invalid token")

    const { email, exp } = decodedToken

    if (!email) return res.status(400).send("Email is required")
    if (!validator.isEmail(email)) return res.status(400).send("Invalid email")

    const { db } = await getDb()

    try {
        // Check if the user already exists
        const existingUser = await db.collection("users").findOne({ email })

        if (existingUser) {
            return res.status(400).send("User with this email already exists")
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal server error")
    }

    return res.status(200).json({ email, expirationTime: exp })
}
