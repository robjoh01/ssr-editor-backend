"use strict"

import jwt from "jsonwebtoken"

/**
 * Signs an access token for the given payload.
 * @param {object} payload - The payload to sign.
 * @returns {string} The signed access token.
 */
export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" })
}

/**
 * Verifies an access token.
 * @param {string} token - The token to verify.
 * @returns {Promise<object|boolean>} The decoded payload if the token is valid, false otherwise.
 */
export async function verifyAccessToken(token) {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return resolve(false)
            resolve(decoded)
        })
    })
}

/**
 * Signs a refresh token for the given payload.
 * @param {object} payload - The payload to sign.
 * @returns {string} The signed refresh token.
 */
export function signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    })
}

/**
 * Verifies a refresh token.
 * @param {string} token - The token to verify.
 * @returns {Promise<object|boolean>} The decoded payload if the token is valid, false otherwise.
 */
export async function verifyRefreshToken(token) {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return resolve(false)
            resolve(decoded)
        })
    })
}

/**
 * Generates both access and refresh tokens for the given user.
 * @param {object} user - The user to generate tokens for.
 * @returns {object} An object with both the access and refresh tokens.
 */
export function generateTokens(user) {
    const accessToken = signAccessToken({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    })

    const refreshToken = signRefreshToken({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    })

    return { accessToken, refreshToken }
}
