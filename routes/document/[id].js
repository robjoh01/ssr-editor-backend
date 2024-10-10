"use strict"

import {
    fetchDocument,
    updateDocument,
    removeDocument,
} from "@/collections/documents.js"

// Get a single document
export const get = async (req, res) => {
    try {
        const id = req.params.id

        if (!id)
            return res.status(400).send("Bad Request! Missing id parameter.")

        const doc = await fetchDocument(id)
        return res.status(200).json(doc)
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Update a single document
export const put = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(400).send("Bad Request! Missing id parameter.")
        }

        const { title, content, ownerId, isLocked } = req.body

        // Check if at least one property is being updated
        if (!title && !content && !ownerId && typeof isLocked === "undefined") {
            return res
                .status(400)
                .send(
                    "Bad Request! Missing title, content, ownerId, or isLocked parameter."
                )
        }

        // Construct an object with only the properties that are provided
        const updateProps = {}
        if (title) updateProps.title = title
        if (content) updateProps.content = content
        if (ownerId) updateProps.ownerId = ownerId
        if (typeof isLocked !== "undefined") updateProps.isLocked = isLocked

        // Call the update function with the id and updateProps
        await updateDocument(id, updateProps)

        return res.status(200).json({
            message: `Document with ID ${id} was successfully updated.`,
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Delete a single document
export const del = async (req, res) => {
    try {
        const id = req.params.id

        if (!id)
            return res.status(400).send("Bad Request! Missing id parameter.")

        const result = await removeDocument(id)

        if (!result)
            return res.status(404).send(`No document found with ID ${id}.`)

        // Check if the delete operation was successful
        if (result.acknowledged && result.deletedCount > 0) {
            return res
                .status(200)
                .send(`Document with ID ${id} was successfully deleted.`)
        } else if (result.acknowledged && result.deletedCount === 0) {
            return res.status(404).send(`No document found with ID ${id}.`)
        } else {
            return res.status(500).send("Failed to delete the document.")
        }
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
