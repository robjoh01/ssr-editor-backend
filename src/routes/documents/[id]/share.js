"use strict"

import { ObjectId } from "mongodb"
import { getDb } from "@utils/database.js"

import {
    fetchDocument,
    checkDocumentExistsByID,
} from "@collections/documents.js"

import { checkUserExistsByEmail } from "@collections/users.js"

import { sendEmailWithTemplate } from "@utils/email.js"

import authenticateJWT from "@middlewares/authenticateJWT.js"
import validator from "validator"

/**
 * Share a document with other users.
 *
 * Request Headers:
 *  - `Authorization` (required): The access token of the user.
 *
 * Request Body:
 *  - `users` (required): An array of users to share the document with.
 *  - `redirectURL` (optional): The URL to redirect the user to after sharing the document.
 *
 * Example API call:
 * POST /api/documents/:id/share
 *
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} Sends a success message if the document was shared, or an error message if not.
 */
export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId } = req.params
        const { users, redirectURL } = req.body // Get users array from request body

        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).send("Bad Request! Missing users.")
        }

        const doesDocumentExist = await checkDocumentExistsByID(documentId)

        if (!doesDocumentExist) {
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)
        }

        const document = await fetchDocument(documentId)

        if (!document.ownerId.equals(user._id))
            return res
                .status(403)
                .send("You are not the owner of this document")

        for (const elem of users) {
            if (!elem.email || !elem.canWrite) {
                return res
                    .status(400)
                    .send(
                        "Bad Request! Each user must have id, email and canWrite."
                    )
            }

            if (!validator.isEmail(elem.email)) {
                return res.status(400).send("Invalid email: " + elem.email)
            }

            // Check if the user exists in the database
            const userId = await checkUserExistsByEmail(elem.email)

            if (!userId) {
                return res
                    .status(404)
                    .send(`User with email ${elem.email} not found.`)
            }

            if (document.ownerId.equals(userId))
                return res
                    .status(400)
                    .send("You cannot share your own document")

            if (document.collaborators.includes(userId))
                return res
                    .status(400)
                    .send("You have already shared this document")

            elem.id = userId
        }

        const data = users.map((user) => ({
            userId: user.id,
            canWrite: user.canWrite,
        }))

        const { db } = await getDb()

        try {
            // Push each user in the data array to the collaborators array
            await db
                .collection("documents")
                .updateOne(
                    { _id: new ObjectId(documentId) },
                    { $push: { collaborators: { $each: data } } }
                )
        } catch (err) {
            console.log(err)
            return res.status(500).send("Internal Server Error")
        } finally {
            await db.client.close()
        }

        // Send an email invitation for each user
        await Promise.all(
            users.map((invitedUser) =>
                sendEmailWithTemplate(
                    [invitedUser.email],
                    "Invitation to a document",
                    "templates/document/share.ejs",
                    {
                        recipientName: invitedUser.name || invitedUser.email,
                        senderName: user.name || user.email,
                        documentLink: redirectURL,
                    }
                )
            )
        )

        return res.status(200).send("Document shared successfully")
    },
]
