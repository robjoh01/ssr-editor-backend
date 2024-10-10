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
 * @param {Object} options - The document options.
 * @param {string} options.title - The title of the document.
 * @param {string} options.content - The content of the document.
 * @param {string} options.ownerId - The ID of the owner.
 * @param {boolean} [options.isLocked=false] - Whether the document is locked.
 * @param {Date} [options.createdAt] - The date the document was created (optional).
 * @param {Date} [options.updatedAt] - The date the document was last updated (optional).
 *
 * @return {Promise<object>} - The created document as an object.
 */
export async function createDocument(options) {
    // Destructure the options with default values
    const {
        title,
        content,
        ownerId,
        isLocked = false,
        createdAt = new Date(),
        updatedAt = createdAt,
    } = options

    if (!title || !content || !ownerId) {
        throw new Error("Missing required fields")
    }

    const { db } = await getDb()

    try {
        return await db.collection("documents").insertOne({
            title,
            content,
            owner_id: new ObjectId(ownerId),
            is_locked: isLocked,
            created_at: createdAt,
            updated_at: updatedAt,
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
 *
 * @param {string} id - The id of the document (required).
 * @param {Object} [props] - Optional properties to update.
 * @param {string} [props.title] - The title of the document.
 * @param {string} [props.content] - The content of the document.
 * @param {ObjectId} [props.ownerId] - The owner of the document.
 * @param {boolean} [props.isLocked] - Whether the document is locked.
 *
 * @return {Promise<void>}
 */
export async function updateDocument(id, props = {}) {
    if (!id) throw new Error("Missing id")

    const { title, content, ownerId, isLocked } = props

    const updateData = {
        ...(title && { title }),
        ...(content && { content }),
        ...(ownerId && { owner_id: new ObjectId(ownerId) }),
        ...(isLocked !== undefined && { is_locked: isLocked }),
        updated_at: new Date(),
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
