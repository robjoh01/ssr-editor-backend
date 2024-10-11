"use strict"

import {
    fetchDocument,
    updateDocument,
    removeDocument,
} from "@/collections/documents.js"

/**
 * Retrieve a single document from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to retrieve.
 *
 * Example API call:
 * GET /api/document/:id
 *
 * @async
 * @param {object} req - The request object, containing the document ID in the params.
 * @param {object} res - The response object, used to send the document back to the client.
 * @returns {Promise<void>} Sends the document as a JSON response or an error message if not found.
 */
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

/**
 * Update an existing document in the database.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to update.
 *
 * Request Body:
 *  - `title` (optional): The new title of the document.
 *  - `content` (optional): The new content of the document.
 *  - `ownerId` (optional): The ID of the new owner of the document.
 *  - `collaborators` (optional): Updated list of collaborators.
 *  - `comments` (optional): Updated list of comments.
 *  - `stats` (optional): Updated document statistics (totalEdits, totalViews, activeComments, activeUsers).
 *
 * Query Parameters:
 *  - `returnDocument` (optional): If `true`, the updated document will be returned in the response.
 *
 * Example API call:
 * PUT /api/document/:id?returnDocument=true
 *
 * Request Body:
 * {
 *   "title": "Updated Title",
 *   "content": "Updated content",
 *   "ownerId": "66eae0bd0f6e02824705d72c",
 *   "collaborators": [],
 *   "comments": [],
 *   "stats": {
 *     "totalEdits": 5,
 *     "totalViews": 100,
 *     "activeComments": 2,
 *     "activeUsers": 3
 *   }
 * }
 *
 * @async
 * @param {object} req - The request object, containing the document ID in the params and the update data in the body.
 * @param {object} res - The response object, used to send the result back to the client.
 * @returns {Promise<void>} Sends a success message or an updated document based on the query parameter.
 */
export const put = async (req, res) => {
    try {
        const id = req.params.id
        const { returnDocument } = req.query

        // Validate the document ID
        if (!id) {
            return res.status(400).send("Bad Request! Missing document ID.")
        }

        const { title, content, ownerId, collaborators, comments, stats } =
            req.body

        // Check if at least one property is being updated
        if (
            !title &&
            !content &&
            !ownerId &&
            !collaborators &&
            !comments &&
            !stats
        ) {
            return res
                .status(400)
                .send("Bad Request! Missing properties to update.")
        }

        // Construct an object with only the properties that are provided
        const updateProps = {}
        if (title) updateProps.title = title
        if (content) updateProps.content = content
        if (ownerId) updateProps.ownerId = new ObjectId(ownerId)
        if (collaborators) updateProps.collaborators = collaborators
        if (comments) updateProps.comments = comments
        if (stats) updateProps.stats = stats

        // Call the updateDocument function with the ID and updateProps
        const updateResult = await updateDocument(id, updateProps)

        if (updateResult) {
            // If returnDocument is true, return the updated document
            if (returnDocument === "true") {
                const updatedDocument = await fetchDocument(id)
                return res.status(200).json(updatedDocument)
            }

            // Otherwise, return a success message
            return res.status(200).json({
                message: `Document with ID ${id} was successfully updated.`,
            })
        } else {
            return res
                .status(500)
                .send("Internal Server Error: Document not updated.")
        }
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

/**
 * Delete a document from the database by its ID.
 *
 * Request Parameters:
 *  - `id` (required): The ID of the document to delete.
 *
 * Example API call:
 * DELETE /api/documentt/:id
 *
 * @async
 * @param {object} req - The request object, containing the document ID in the params.
 * @param {object} res - The response object, used to send the result of the deletion back to the client.
 * @returns {Promise<void>} Sends a success message if the document was deleted, or an error message if not.
 */
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
