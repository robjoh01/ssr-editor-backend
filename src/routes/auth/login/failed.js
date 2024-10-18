"use strict"

export const get = async (req, res) => {
    return res.status(401).send("Unauthorized")
}
