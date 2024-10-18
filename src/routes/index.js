"use strict"

// Default route
export const get = async (req, res) => {
    if (req.method !== "GET") return res.status(405)

    return res.status(404).send("Not Found. Try /api/help")
}
