"use strict"

import passport from "@utils/passport.js"
import { updateUserLastLogin } from "@collections/users.js"
import { generateTokens } from "@utils/token.js"

/**
 * Login a user using their email and password.
 *
 * Example API call:
 * GET /api/auth/login
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the new access token as a JSON response (including user's details).
 */
export const post = async (req, res, next) => {
    passport.authenticate(
        "local",
        { session: false },
        async (err, user, info) => {
            if (err) return next(err) // Handle any errors
            if (!user)
                return res.status(401).json({
                    error: info?.message || "Invalid credentials",
                }) // If no user, return 401

            delete user.passwordHash
            await updateUserLastLogin(user._id)

            const { accessToken, refreshToken } = generateTokens(user)

            // Store the refresh token in a secure HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })

            // Send access token to the client
            return res.status(200).json({ accessToken, user })
        }
    )(req, res, next)
}
