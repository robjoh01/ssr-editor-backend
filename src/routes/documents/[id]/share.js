"use strict"

import {
    checkDocumentExistsByID,
    updateDocument,
} from "@collections/documents.js"
import { sendEmailWithTemplate } from "@/utils/email.js"

import authenticateJWT from "@/middlewares/authenticateJWT.js"
import validator from "validator"

export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { user, isValid } = req

        if (!isValid) return res.status(404).send("User not found")

        const { id: documentId, email, canWrite } = req.params

        const doesExist = await checkDocumentExistsByID(documentId)

        if (!doesExist)
            return res
                .status(404)
                .send(`Document with ID ${documentId} not found.`)

        if (!email) return res.status(400).send("Bad Request! Missing email.")
        if (!canWrite)
            return res.status(400).send("Bad Request! Missing canWrite.")

        if (!validator.isEmail(email))
            return res.status(400).send("Invalid email")

        // Push the user to the collaborators array
        await updateDocument(
            documentId,
            { $push: { collaborators: { userId: user._id, canWrite } } },
            { upsert: true }
        )

        // Send an email invitation
        await sendEmailWithTemplate(
            email,
            "Invitation to a document",
            "templates/document/share.ejs",
            {
                recipientName: user.name,
                senderName: user.name,
                documentLink: `${process.env.BASE_URL}/documents/${documentId}`,
            }
        )

        // If the user clicks on the link, the user will be able to see the document.
        return res.status(200).send("Document shared successfully")
    },
]
