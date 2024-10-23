"use strict"

import { getDb } from "@utils/database.js"
import { checkDocumentExistsByID } from "@collections/documents.js"

import authenticateJWT from "@/middlewares/authenticateJWT.js"

export const del = [
    authenticateJWT(),
    async (req, res) => {
        const { isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params

        const doesExist = await checkDocumentExistsByID(documentId)

        if (!doesExist)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

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
