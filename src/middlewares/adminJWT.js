import authenticateJWT from "@middlewares/authenticateJWT.js"

/* eslint-disable no-unused-vars */

/**
 * Verifies the JWT token sent in the Authorization header and ensures the user is an administrator.
 * @param {object} options - Options object that can be used to customize the middleware.
 * @returns {function} Middleware function that verifies the JWT token and checks the user's admin status.
 */
export default (options) => [
    authenticateJWT(),
    async (req, res, next) => {
        const { user } = req

        if (!user.isAdmin) return res.status(403).send("Not an admin")

        next()
    },
]
