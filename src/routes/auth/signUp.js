"use strict"

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
    const { email, password } = req.body

    if (!email || !password) throw new Error("Email and password are required")

    if (!validator.isEmail(email)) throw new Error("Invalid email")

    if (!validator.isStrongPassword(password))
        throw new Error("Invalid password")

    const { db } = await getDb()

    try {
        await db
            .collection("users")
            .insertOne({ email, passwordHash: await hashPassword(password) })

        return res.redirect("/api/auth/login", {
            email,
            password,
        })
    } catch (err) {
        console.error(err)
    }
}
