"use strict"

import jwt from "jsonwebtoken"

export function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
}

export function verifyToken(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return false

        return decoded
    })
}
