"use strict"

import database from "./database.mjs"
import { ObjectId } from "mongodb"

const documents = {
    reformat: (document) => {
        if (!document._id) {
            throw new Error("Document is missing the '_id' field.")
        }

        return {
            id: document._id ? document._id.toString() : null,
            title: document.title || "Untitled",
            content: document.content || "",
            createdAt: document.created_at
                ? new Date(document.created_at)
                : new Date(),
            updatedAt: document.updated_at
                ? new Date(document.updated_at)
                : new Date(),
            ownerId: document.owner_id ? document.owner_id.toString() : null,
            isLocked:
                typeof document.is_locked === "boolean"
                    ? document.is_locked
                    : false,
        }
    },

    /**
     * Retrieve all documents from the database.
     *
     * @async
     *
     * @return {Promise<array>} The resultset as an array of documents.
     */
    getAll: async () => {
        const db = await database.getInstance()

        try {
            const elements = await db.collection.find().toArray()

            const formattedDocuments = elements.map((document) => {
                return documents.reformat(document)
            })

            return formattedDocuments
        } catch (err) {
            console.error(err)
            return []
        } finally {
            await db.client.close()
        }
    },

    /**
     * Retrieve a single document from the database by its id.
     *
     * @async
     *
     * @param {string} id The id of the document to retrieve.
     *
     * @return {Promise<object>} The document as an object.
     */
    get: async (id) => {
        if (!id) throw new Error("Missing id")

        const db = await database.getInstance()

        try {
            const document = await db.collection.findOne({
                _id: new ObjectId(id),
            })

            return documents.reformat(document)
        } catch (err) {
            console.error(err)
            return {}
        } finally {
            await db.client.close()
        }
    },

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
    create: async (options) => {
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

        const db = await database.getInstance()

        try {
            return await db.collection.insertOne({
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
    },

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
    update: async (id, props = {}) => {
        if (!id) throw new Error("Missing id")

        const { title, content, ownerId, isLocked } = props

        const updateData = {
            ...(title && { title }),
            ...(content && { content }),
            ...(ownerId && { owner_id: new ObjectId(ownerId) }),
            ...(isLocked !== undefined && { is_locked: isLocked }),
            updated_at: new Date(),
        }

        const db = await database.getInstance()

        try {
            await db.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            )

            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            await db.client.close()
        }
    },

    /**
     * Delete a document.
     *
     * @async
     *
     * @param {ObjectId} id The id of the document to delete.
     *
     * @return {Promise<DeleteResult>}
     */
    delete: async (id) => {
        if (!id) throw new Error("Missing id")

        const db = await database.getInstance()

        try {
            return await db.collection.deleteOne({ _id: new ObjectId(id) })
        } catch (err) {
            console.error(err)
            return undefined
        } finally {
            await db.client.close()
        }
    },

    /**
     * Reset the document collection by removing all existing documents and
     * inserting a default set of documents.
     *
     * @async
     *
     * @param {Array} initialDocuments - The default set of documents to insert.
     *
     * @return {Promise<void>} - Void.
     */
    reset: async (initialDocuments) => {
        if (!initialDocuments) throw new Error("Missing initial documents")

        const db = await database.getInstance()

        try {
            await db.collection.deleteMany({}) // Delete all documents
            await db.collection.insertMany(initialDocuments)
        } catch (err) {
            console.error(err)
        } finally {
            await db.client.close()
        }
    },
}

export default documents
