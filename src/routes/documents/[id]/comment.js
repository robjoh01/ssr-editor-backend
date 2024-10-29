"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"
import { fetchDocument } from "@collections/documents.js"

import authenticateJWT from "@/middlewares/authenticateJWT.js"

export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params
        const { position, content } = req.body

        if (!ObjectId.isValid(documentId))
            return res
                .status(400)
                .send("Bad Request! Invalid documentId format.")

        if (!position || !content)
            return res.status(400).send("Bad Request! Missing parameters.")

        const document = await fetchDocument(documentId)

        if (!document)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

        const { db } = await getDb()

        try {
            const result = await db.collection("comments").insertOne({
                position,
                content,
                resolved: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                documentId: new ObjectId(documentId),
                userId: new ObjectId(user._id),
            })

            if (!result.acknowledged)
                return res.status(500).send("Failed to create the comment.")
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        } finally {
            await db.client.close()
        }

        return res.status(201).send("Comment created.")
    },
]
