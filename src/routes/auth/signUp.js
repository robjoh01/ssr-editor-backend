"use strict"

import { getDb } from "@utils/database.js"
import { hashPassword } from "@utils/crypt.js"
import validator from "validator"

/**
 * Sign up a new user.
 *
 * Example API call:
 * GET /api/auth/signUp
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Redirects to the login page.
 */
export const post = async (req, res) => {
    const { name, email, password } = req.body

    if (!email || !password) throw new Error("Email and password are required")

    if (!validator.isEmail(email)) throw new Error("Invalid email")

    if (!validator.isStrongPassword(password))
        throw new Error("Invalid password")

    const { db } = await getDb()

    try {
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
