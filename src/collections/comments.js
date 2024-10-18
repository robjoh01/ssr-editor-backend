import { getDb } from "@utils/database.js"
import { ObjectId } from "mongodb"

/**
 * Retrieve comments from the database with optional filters and sorting.
 *
 * @async
 * @param {object} filters - The filters to apply (e.g., shared, modifiable).
 * @param {object} sortOptions - The sorting options (e.g., { lastUpdated: -1 }).
 * @return {Promise<array>} The resultset as an array of comments.
 */
export async function fetchAllComments(
    filters = {},
    sortOptions = { lastUpdated: -1 }
) {
    const { db } = await getDb()

    try {
        // Apply filters and sorting
        return await db
            .collection("comments")
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
 * @param {string} ownerId - The ID of the owner.
 * @param {Object} comment - The comment.
 * @return {Promise<object>} - The created comment as an object.
 * @throws {Error} If the comment could not be created.
 */
export async function createComment(comment) {
    const { db } = await getDb()

    try {
        return await db.collection("comments").insertOne(comment)
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
                    updatedAt: new Date(),
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
