import { getDb } from "@utils/database.js"
import { ObjectId } from "mongodb"

// TODO: Update user's lastLogin property
export async function updateUserLastLogin(userId) {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            lastLogin: new Date(),
        },
        { new: true }
    )
    return updatedUser
}

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

    const { db } = await getDb()

    try {
        return await db.collection("users").findOne({ _id: new ObjectId(id) })
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

export async function createUser(user) {}

export async function updateUser(id, user) {}

export async function removeUser(id) {}
