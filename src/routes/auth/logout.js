"use strict"

import authenticateJWT from "@middlewares/authenticateJWT.js"

/**
 * Logs the user out by removing the refresh token cookie.
 *
 * Request Cookies:
 *  - `refreshToken` (required): The refresh token of the user.
 *
 * Example API call:
 * POST /api/auth/logout
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message after clearing the refresh token cookie.
 */
export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(400).send("Refresh token not found")
        }

        // Clear the refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })

        return res.status(200).send("Logout successful")
    },
]
