import { verifyAccessToken } from "@utils/token.js"

import { checkUserExistsByID } from "@collections/users.js"

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
    const accessToken = authHeader && authHeader.split(" ")[1]

    // If no token is provided, return a 403 error.
    if (!accessToken) return res.status(403).send("No token provided")

    // Verify the token to ensure it is valid and not expired.
    const decoded = await verifyAccessToken(accessToken)

    // If the token is invalid or expired, return a 401 error.
    if (!decoded) return res.status(401).send("Invalid or expired token")

    // Check if the user is exists
    const doesUserExist = await checkUserExistsByID(decoded._id)

    // If the token is valid, inject the decoded token data into the request object
    // for use in subsequent middleware or routes.
    req.user = decoded
    req.accessToken = accessToken
    req.isValid = doesUserExist

    next()
}
