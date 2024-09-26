"use strict"

import database from "./database.mjs"
import { ObjectId, Timestamp } from "mongodb"

const reformatDocument = ({ ...document }) => {
    return {
        id: document._id.toString(),
        title: document.title,
        content: document.content,
        createdAt: new Date(document.created_at),
        updatedAt: new Date(document.updated_at),
        ownerId: document.owner_id,
        isLocked: document.is_locked,
    }
}

const documents = {
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
            const documents = await db.collection.find().toArray()

            const formattedDocuments = documents.map((document) => {
                return reformatDocument(document)
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
     * @param {ObjectId} id The id of the document to retrieve.
     *
     * @return {Promise<object>} The document as an object.
     */
    get: async (id) => {
        const db = await database.getInstance()

        try {
            const document = await db.collection.findOne({
                _id: new ObjectId(id),
            })
            return reformatDocument(document)
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
     * @param {ObjectId} options.ownerId - The ID of the owner.
     * @param {boolean} [options.isLocked=false] - Whether the document is locked.
     * @param {Date} [options.createdAt] - The date the document was created (optional).
     * @param {Date} [options.updatedAt] - The date the document was last updated (optional).
     *
     * @return {Promise<object>} - The created document as an object.
     */
    create: async (options) => {
        const db = await database.getInstance()

        // Destructure the options with default values
        const {
            title,
            content,
            ownerId,
            isLocked = false,
            createdAt = new Date(),
            updatedAt = createdAt,
        } = options

        try {
            return await db.collection.insertOne({
                title,
                content,
                owner_id: ownerId,
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
     * @param {ObjectId} id - The id of the document (required).
     * @param {Object} [props] - Optional properties to update.
     * @param {string} [props.title] - The title of the document.
     * @param {string} [props.content] - The content of the document.
     * @param {ObjectId} [props.ownerId] - The owner of the document.
     * @param {boolean} [props.isLocked] - Whether the document is locked.
     *
     * @return {Promise<void>}
     */
    update: async (id, props = {}) => {
        const db = await database.getInstance()

        const { title, content, ownerId, isLocked } = props

        const updateData = {
            ...(title && { title }),
            ...(content && { content }),
            ...(ownerId && { owner_id: new ObjectId(ownerId) }),
            ...(isLocked !== undefined && { is_locked: isLocked }),
            updated_at: new Date(),
        }

        try {
            await db.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            )
        } catch (err) {
            console.error(err)
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
        const db = await database.getInstance()

        try {
            await db.collection.deleteMany()
            await db.collection.insertMany(initialDocuments)
        } catch (err) {
            console.error(err)
        } finally {
            await db.client.close()
        }
    },
}

export default documents
