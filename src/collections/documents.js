import { getDb } from "@utils/database.js"
import { ObjectId } from "mongodb"

/**
 * Retrieve documents from the database with optional filters and sorting.
 *
 * @async
 * @param {object} filters - The filters to apply (e.g., shared, modifiable).
 * @param {object} sortOptions - The sorting options (e.g., { lastUpdated: -1 }).
 * @return {Promise<array>} The resultset as an array of documents.
 */
export async function fetchAllDocuments(
    filters = {},
    sortOptions = { lastUpdated: -1 }
) {
    const { db } = await getDb()

    try {
        // Apply filters and sorting
        return await db
            .collection("documents")
            .find(filters)
            .sort(sortOptions)
            .toArray()
    } catch (err) {
        console.error(err)
        return []
    } finally {
        await db.client.close()
    }
}

/**
 * Retrieve a single document from the database by its id.
 *
 * @async
 *
 * @param {string} id The id of the document to retrieve.
 *
 * @return {Promise<object>} The document as an object.
 * @throws {Error} If the document is not found.
 */
export async function fetchDocument(id) {
    if (!id) throw new Error("Missing id")

    const { db } = await getDb()

    try {
        return await db.collection("documents").findOne({
            _id: new ObjectId(id),
        })
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Create a new document in the database.
 *
 * @async
 *
 * @param {string} ownerId - The ID of the owner.
 * @param {Object} document - The document options.
 * @param {string} document.title - The title of the document.
 * @param {string} document.content - The content of the document.
 * @param {Date} [document.createdAt] - The date the document was created (optional).
 *
 * @return {Promise<object>} - The created document as an object.
 * @throws {Error} If the owner ID is missing.
 * @throws {Error} If the document is missing required fields.
 */
export async function createDocument(ownerId, document) {
    if (!ownerId) {
        throw new Error("Missing ownerId")
    }

    const { title, content } = document

    if (!title || !content) {
        throw new Error("Missing required fields")
    }

    const { db } = await getDb()

    try {
        return await db.collection("documents").insertOne({
            title,
            content,
            collaborators: [],
            comments: [],
            stats: {
                totalEdits: 0,
                totalViews: 0,
                activeComments: 0,
                activeUsers: 0,
            },
            createdAt: new Date(),
            updatedAt: null,
            ownerId: new ObjectId(ownerId),
        })
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Update a document in the database.
 *
 * @async
 * @param {string} id - The id of the document (required).
 * @param {Object} [document] - Optional properties to update.
 * @param {string} [document.title] - The title of the document.
 * @param {string} [document.content] - The content of the document.
 * @param {ObjectId} [document.ownerId] - The owner of the document.
 * @param {Array} [document.collaborators] - List of collaborators to update.
 * @param {Array} [document.comments] - List of comments to update.
 * @param {Object} [document.stats] - Stats to update (totalEdits, totalViews, activeComments, activeUsers).
 *
 * @return {Promise<void>}
 * @throws {Error} If the id is missing.
 */
export async function updateDocument(id, document = {}) {
    if (!id) throw new Error("Missing id")

    const { title, content, ownerId, collaborators, comments, stats } = document

    const updateData = {
        ...(title && { title }),
        ...(content && { content }),
        ...(ownerId && { ownerId: new ObjectId(ownerId) }),
        ...(collaborators && { collaborators }),
        ...(comments && { comments }),
        ...(stats && { stats }),
        updatedAt: new Date(),
    }

    const { db } = await getDb()

    try {
        await db
            .collection("documents")
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

        return true
    } catch (err) {
        console.error(err)
        return false
    } finally {
        await db.client.close()
    }
}

/**
 * Remove a document.
 *
 * @async
 *
 * @param {ObjectId} id The id of the document to remove.
 *
 * @return {Promise<DeleteResult>}
 * @throws {Error} If the id is missing.
 */
export async function removeDocument(id) {
    if (!id) throw new Error("Missing id")

    const { db } = await getDb()

    try {
        return await db
            .collection("documents")
            .deleteOne({ _id: new ObjectId(id) })
    } catch (err) {
        console.error(err)
        return undefined
    } finally {
        await db.client.close()
    }
}
