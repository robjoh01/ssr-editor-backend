"use strict"

import { getDb } from "@utils/database.js"
import { signAccountToken } from "@utils/token.js"
import { sendEmailWithTemplate } from "@/utils/email.js"

import validator from "validator"

/**
 * Sign up a new user.
 *
 * Example API call:
 * POST /api/auth/signUp
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the user was created, or an error message if not.
 */
export const post = async (req, res) => {
    const { email, redirect } = req.body

    if (!email) return res.status(400).send("Email is required")
    if (!validator.isEmail(email)) return res.status(400).send("Invalid email")
    if (!redirect) return res.status(400).send("Redirect is required")

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

    const token = signAccountToken({
        email,
    })

    await sendEmailWithTemplate(
        [email],
        "Account Verification",
        "templates/account/created.ejs",
        {
            recipientName: email,
            verificationLink: `${redirect}/${token}`,
        }
    )
}
