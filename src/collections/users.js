import { getDb } from "@utils/database.js"
import { ObjectId } from "mongodb"

import { hashPassword } from "@utils/crypt.js"

/**
 * Retrieve users from the database with optional filters and sorting.
 *
 * @async
 * @param {object} filters - The filters to apply (e.g., shared, modifiable).
 * @param {object} sortOptions - The sorting options (e.g., { lastUpdated: -1 }).
 * @return {Promise<array>} The resultset as an array of users.
 */
export async function fetchAllUsers(
    filters = {},
    sortOptions = { lastUpdated: -1 }
) {
    const { db } = await getDb()

    try {
        // Apply filters and sorting
        return await db
            .collection("users")
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
 * Retrieve a single user from the database by its id.
 *
 * @async
 *
 * @param {string} id The id of the user to retrieve.
 *
 * @return {Promise<object>} The user as an object.
 * @throws {Error} If the user is not found.
 */
export async function fetchUser(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(id) })

        if (!user) throw new Error("User not found")

        return user
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Retrieve a single user from the database by its email.
 *
 * @async
 *
 * @param {string} email The email of the user to retrieve.
 *
 * @return {Promise<object>} The user as an object.
 * @throws {Error} If the user is not found.
 */
export async function fetchUserByEmail(email) {
    const { db } = await getDb()

    try {
        return await db.collection("users").findOne({ email })
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Create a new user in the database.
 *
 * @async
 *
 * @param {Object} user - The user.
 * @param {string} user.name - The name of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 *
 * @return {Promise<object>} - The created user as an object.
 * @throws {Error} If the user could not be created.
 */
export async function createUser(user) {
    const { db } = await getDb()

    try {
        return await db.collection("users").insertOne(user)
    } catch (err) {
        console.error(err)
        return {}
    } finally {
        await db.client.close()
    }
}

/**
 * Update a user in the database.
 *
 * @async
 * @param {string} id - The id of the user (required).
 * @param {Object} [user] - Optional properties to update.
 *
 * @return {Promise<void>}
 * @throws {Error} If the user could not be updated.
 */
export async function updateUser(id, user) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { name, email, password, stats, profilePicture } = user

    const updateData = {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { passwordHash: await hashPassword(password) }),
        ...(stats && { stats }),
        ...(profilePicture && { profilePicture }),
        updatedAt: new Date().toISOString(),
    }

    const { db } = await getDb()

    try {
        await db
            .collection("users")
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
 * Update the user's last login time.
 *
 * @async
 * @param {string} id - The id of the user (required).
 * @return {Promise<boolean>} - Returns true if the update was successful, otherwise false.
 * @throws {Error} If the user could not be updated.
 */
export async function updateUserLastLogin(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const updateData = {
        lastLogin: new Date().toISOString(),
    }

    const { db } = await getDb()

    try {
        await db
            .collection("users")
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
 * Remove a user.
 *
 * @async
 *
 * @param {ObjectId} id The id of the user to remove.
 *
 * @return {Promise<DeleteResult>}
 * @throws {Error} If the user could not be removed.
 */
export async function removeUser(id) {
    if (!id) throw new Error("Missing id")

    if (!ObjectId.isValid(id))
        throw new Error("Invalid id. Must be a valid ObjectId.")

    const { db } = await getDb()

    try {
        return await db.collection("users").deleteOne({ _id: new ObjectId(id) })
    } catch (err) {
        console.error(err)
        return undefined
    } finally {
        await db.client.close()
    }
}
