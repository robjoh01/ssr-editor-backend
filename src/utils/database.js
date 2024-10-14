"use strict"

import "dotenv/config"
import { MongoClient, ServerApiVersion } from "mongodb"

export async function getDb() {
    let dsn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jsramverk.edlj3.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(dsn, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    })

    await client.connect() // Ensure client is connected before returning

    const db = client.db("ssr-editor")

    return {
        client, // Return the client so the connection can be closed elsewhere
        db, // Return db object for other operations
    }
}

/**
 * Find documents in a collection by matching search criteria.
 *
 * @async
 *
 * @param {object} db        Database connection object.
 * @param {string} collectionName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
export async function findInCollection(
    db,
    collectionName,
    criteria,
    projection = {},
    limit = 0
) {
    const collection = db.collection(collectionName)

    try {
        return await collection
            .find(criteria)
            .project(projection)
            .limit(limit)
            .toArray()
    } catch (err) {
        console.error("Error finding documents in collection:", err)
        return []
    }
}

/**
 * Reset a collection by removing existing content and inserting a default
 * set of documents.
 *
 * @async
 *
 * @param {object} db        Database connection object.
 * @param {string} collectionName Name of collection.
 * @param {array} initialElements     Default set of elements to insert.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<void>} Void
 */
export async function resetCollection(db, collectionName, initialElements) {
    const collection = db.collection(collectionName)

    try {
        await collection.deleteMany() // Remove all documents from the collection
        await collection.insertMany(initialElements) // Insert the default documents
    } catch (err) {
        console.error("Error resetting collection:", err)
    }
}
