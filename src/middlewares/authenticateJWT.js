import { verifyAccessToken } from "@utils/token.js"

/* eslint-disable no-unused-vars */

/**
 * Middleware that verifies a JWT token sent in the Authorization header
 * and injects the decoded token data into the request object.
 * @param {object} options - Options object that can be used to customize the middleware.
 * @returns {function} Middleware function that verifies the JWT token.
 */
export default (options) => async (req, res, next) => {
    // Extract the token from the Authorization header.
    // The header should be in the format "Bearer <token>".
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    // If no token is provided, return a 403 error.
    if (!token) return res.status(403).json({ message: "No token provided" })

    // Verify the token to ensure it is valid and not expired.
    const decoded = await verifyAccessToken(token)

    // If the token is invalid or expired, return a 401 error.
    if (!decoded)
        return res.status(401).json({ message: "Invalid or expired token" })

    // If the token is valid, inject the decoded token data into the request object
    // for use in subsequent middleware or routes.
    req.user = decoded
    next()
}
