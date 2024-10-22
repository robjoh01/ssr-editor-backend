"use strict"

import { signAccessToken, verifyRefreshToken } from "@utils/token.js"

/**
 * Refresh access token.
 *
 * Request Cookies:
 *  - `refreshToken` (required): The refresh token of the user.
 *
 * Example API call:
 * POST /api/auth/refresh
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends the new access token as a JSON response.
 */
export const post = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(403).send("Refresh token not provided")

    // Verify the refresh token
    const user = await verifyRefreshToken(refreshToken)

    if (!user) return res.status(403).send("Invalid refresh token")

    // Generate new access token
    const newAccessToken = signAccessToken({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    })

    return res.status(200).json({
        accessToken: newAccessToken,
        user: {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    })
}
