"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"
import {
    checkDocumentExistsByID,
    fetchDocument,
} from "@collections/documents.js"

import authenticateJWT from "@/middlewares/authenticateJWT.js"

export const del = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params

        const document = await fetchDocument(documentId)

        if (!document)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

        if (!document.ownerId.equals(user._id))
            return res.status(403).send("Forbidden! You are not the owner.")

        const { db } = await getDb()

        try {
            await db
                .collection("documents")
                .deleteOne({ _id: new ObjectId(documentId) })
        } catch (err) {
            console.error(err)
            return res.status(500).send("Internal server error")
        }

        return res
            .status(200)
            .send(`Document with ID ${documentId} was successfully deleted.`)
    },
]
