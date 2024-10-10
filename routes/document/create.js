"use strict"

import { createDocument } from "@/collections/documents.js"

// Create a new document
export const post = async (req, res) => {
    try {
        const { title, content, ownerId, isLocked } = req.body

        // Validate required parameters
        if (!title || !content || !ownerId) {
            return res
                .status(400)
                .send(
                    "Bad Request! Missing title, content or ownerId parameter."
                )
        }

        // Prepare options object with optional parameters
        const options = {
            title,
            content,
            ownerId,
            isLocked,
        }

        // Call the create function with the options
        const result = await createDocument(options)

        // Check if the document was successfully created
        if (result.acknowledged) {
            // Retrieve the created document using the insertedId
            const createdDoc = await documents.fetch(result.insertedId)
            return res.status(201).json(createdDoc)
        } else {
            return res
                .status(500)
                .send("Internal Server Error: Document not created.")
        }
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
