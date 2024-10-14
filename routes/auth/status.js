"use strict"

import authenticateJWT from "@middlewares/authenticateJWT.js"

export const get = [
    authenticateJWT(),
    async (req, res) => {
        const { user } = req

        if (!user) return res.status(401).send("Unauthorized")

        return res.status(200).json({ user })
    },
]
