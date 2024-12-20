import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"

/**
 * Find all comments for a specific document.
 * @async
 * @param {string} documentId - The ID of the document.
 * @return {Promise<array>} The resultset as an array of comments.
 * @throws {Error} when database operation fails.
 */
export async function fetchAllCommentsFromDocument(documentId) {
    if (!documentId) throw new Error("Missing documentId")

    if (!ObjectId.isValid(documentId))
        throw new Error("Invalid documentId. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        return await db
            .collection("comments")
            .find({ documentId: new ObjectId(documentId) })
            .toArray()
    } catch (err) {
        console.error(err)
        return []
    } finally {
        await db.client.close()
    }
}

/**
 * Retrieve comments from the database.
 *
 * @async
 * @return {Promise<array>} The resultset as an array of comments.
 */
export async function fetchAllComments() {
    const { db } = await getDb()

    try {
        return await db.collection("comments").toArray()
    } catch (err) {
        console.error(err)
        return []
    } finally {
        await db.client.close()
    }
}

/**
 * Retrieve a single comment from the database by its id.
 *
 * @async
 *
 * @param {string} id The id of the comment to retrieve.
 *
 * @return {Promise<object>} The comment as an object.
 * @throws {Error} If the comment is not found.
 */
export async function fetchComment(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        return await db.collection("comments").findOne({
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
 * Create a new comment in the database.
 *
 * @async
 *
 * @param {string} comment - The comment.
 * @param {string} comment.userId - The ID of the user.
 * @param {string} comment.documentId - The ID of the document.
 * @param {string} comment.position - The position of the comment.
 * @param {string} comment.content - The content of the comment.
 * @return {Promise<object>} - The created comment as an object.
 * @throws {Error} If the comment could not be created.
 */
export async function createComment(comment) {
    const { db } = await getDb()

    // TODO: Calculate the hash of the comment, to avoid duplication.

    try {
        return await db.collection("comments").insertOne({
            ...comment,
            createdAt: new Date().toISOString(),
        })
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Update a comment in the database.
 *
 * @async
 * @param {string} id - The id of the comment (required).
 * @param {Object} [content] - The new content of the comment (required).
 *
 * @return {Promise<void>}
 * @throws {Error} If the comment could not be updated.
 */
export async function updateComment(id, content) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        await db.collection("comments").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    content,
                    updatedAt: new Date().toISOString(),
                },
            }
        )

        return true
    } catch (err) {
        console.error(err)
        return false
    } finally {
        await db.client.close()
    }
}

/**
 * Remove a comment.
 *
 * @async
 *
 * @param {ObjectId} id The id of the comment to remove.
 *
 * @return {Promise<DeleteResult>}
 * @throws {Error} If the comment could not be removed.
 */
export async function removeComment(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        return await db
            .collection("comments")
            .deleteOne({ _id: new ObjectId(id) })
    } catch (err) {
        console.error(err)
        return undefined
    } finally {
        await db.client.close()
    }
}
