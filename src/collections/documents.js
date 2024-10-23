import { getDb } from "@utils/database.js"
import { ObjectId } from "mongodb"

/**
 * Check if a document exists in the database by its id.
 *
 * @param {string} id The id of the document to check.
 * @return {Promise<boolean>} True if the document exists, false otherwise.
 */
export async function checkDocumentExistsByID(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        const user = await db
            .collection("documents")
            .findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } })

        return user !== null
    } catch (err) {
        console.error(err)
        return false
    } finally {
        await db.client.close()
    }
}

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

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

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
 * @param {Object} document - The document.
 * @return {Promise<object>} - The created document as an object.
 * @throws {Error} If the document could not be created.
 */
export async function createDocument(document) {
    const { db } = await getDb()

    try {
        return await db.collection("documents").insertOne(document)
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
 * @param {ObjectId} [document.ownerId] - The owner of the document.
 * @param {string} [document.title] - The title of the document.
 * @param {string} [document.content] - The content of the document.
 * @param {Array} [document.collaborators] - List of collaborators to update.
 * @param {Object} [document.stats] - Stats to update (totalEdits, totalViews, activeComments, activeUsers).
 *
 * @return {Promise<void>}
 * @throws {Error} If the document could not be updated.
 */
export async function updateDocument(id, document = {}) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const {
        title = null,
        content = null,
        ownerId = null,
        collaborators,
        stats = null,
    } = document

    const updateData = {
        ...(title && { title }),
        ...(content && { content }),
        ...(ownerId && { ownerId: new ObjectId(ownerId) }),
        ...(collaborators && { collaborators }),
        ...(stats && { stats }),
        updatedAt: new Date().toISOString(),
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
 * @throws {Error} If the document could not be removed.
 */
export async function removeDocument(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

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
