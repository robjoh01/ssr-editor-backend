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
        // eslint-disable-next-line
        async (err, user, info) => {
            if (err) {
                return res.status(500).send("Internal Server Error")
            }

            if (!user) return res.status(401).send("Invalid credentials")

            delete user.passwordHash

            try {
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
            } catch (err) {
                console.error(err)
                return res.status(500).send("Internal Server Error")
            }
        }
    )(req, res, next)
}
