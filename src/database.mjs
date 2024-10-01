"use strict"

import "dotenv/config"
import { MongoClient, ServerApiVersion } from "mongodb"

const database = {
    getInstance: async function () {
        let dsn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jsramverk.edlj3.mongodb.net/?retryWrites=true&w=majority&appName=jsramverk`

        if (process.env.NODE_ENV === "test") {
            dsn = "mongodb://localhost:27017/test"
        }

        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        })

        const db = await client.db("ssr-editor")
        const collection = await db.collection("documents")

        return {
            client,
            collection,
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {object} db        Database connection.
     * @param {string} collectionName    Name of collection.
     * @param {object} criteria   Search criteria.
     * @param {object} projection What to project in results.
     * @param {number} limit      Limit the number of documents to retrieve.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    findInCollection: async function (
        db,
        collectionName,
        criteria,
        projection,
        limit
    ) {
        const collection = await db.collection(collectionName)

        try {
            return await collection
                .find(criteria, projection)
                .limit(limit)
                .toArray()
        } catch (err) {
            console.error(err)
            return []
        } finally {
            await db.client.close()
        }
    },

    /**
     * Reset a collection by removing existing content and insert a default
     * set of documents.
     *
     * @async
     *
     * @param {object} db        Database connection.
     * @param {string} collectionName Name of collection.
     * @param {string} initialElements     Default set of elements.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<void>} Void
     */
    resetCollection: async function (db, collectionName, initialElements) {
        try {
            const collection = await db.collection(collectionName)
            await collection.deleteMany()
            await collection.insertMany(initialElements)
        } catch (err) {
            console.error(err)
        } finally {
            await db.client.close()
        }
    },
}

export default database
