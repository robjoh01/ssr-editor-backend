"use strict"

import jwt from "jsonwebtoken"

export function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
}

export async function verifyToken(token) {
    return new Promise((resolve) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return resolve(false)
            resolve(decoded)
        })
    })
}
