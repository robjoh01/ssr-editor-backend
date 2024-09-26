"use strict"

import documents from "../../src/documents.js"

// Get all documents
export const get = async (req, res) => {
    try {
        const docs = await documents.getAll()
        return res.status(200).json(docs)
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
