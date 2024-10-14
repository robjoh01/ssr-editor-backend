"use strict"

import { verifyToken } from "@utils/token.js"

export default (options) => async (req, res, next) => {
    const { token } = req.headers

    if (!token) return res.status(403).json({ error: "No token provided" })

    const decoded = await verifyToken(token)

    if (!decoded)
        return res.status(401).json({ error: "Invalid or expired token" })

    // Attach decoded token data to request object for use in subsequent middleware or routes
    req.user = decoded
    next()
}
