"use strict"

import { getDb } from "@utils/database.js"
import { hashPassword } from "@utils/crypt.js"
import { verifyAccountToken } from "@utils/token.js"

import validator from "validator"

/**
 * Create a new user.
 *
 * Example API call:
 * POST /api/auth/signUp/complete
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the user was created, or an error message if not.
 */
export const post = async (req, res) => {
    const { name, email, password, token } = req.body

    if (!name) return res.status(400).send("Name is required")

    if (!email) return res.status(400).send("Email is required")
    if (!validator.isEmail(email)) return res.status(400).send("Invalid email")

    if (!password) return res.status(400).send("Password is required")
    if (!validator.isStrongPassword(password))
        return res.status(400).send("Password is not strong enough")

    // Verify token
    const decodedToken = await verifyAccountToken(token)

    // Check if email from token matches the provided email
    if (decodedToken.email !== email) {
        return res.status(400).send("Email does not match the token")
    }

    const { db } = await getDb()

    try {
        // Check if the user already exists
        const existingUser = await db.collection("users").findOne({ email })

        if (existingUser) {
            return res.status(400).send("User with this email already exists")
        }

        // Insert new user
        await db.collection("users").insertOne({
            isAdmin: false,
            name,
            email,
            passwordHash: await hashPassword(password),
            stats: {
                totalEdits: 0,
                totalComments: 0,
                totalDocuments: 0,
            },
            profilePicture: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        })

        return res.status(200).send("Sign up successful")
    } catch (err) {
        console.error(err)
    }
}
