"use strict"

import authenticateJWT from "@/middlewares/authenticateJWT.js"

import validator from "validator"
import { sendEmailWithTemplate } from "@/utils/email.js"

// FIXME: Add ability to share document

export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { id: documentId } = req.params

        const { user } = req

        const { email } = req.body

        if (!email || !validator.isEmail(email))
            return res.status(400).send("Bad Request. Invalid email.")

        // FIXME: Fix the document's link. Depending on what grant the user has, the link could be different.

        await sendEmailWithTemplate(
            email,
            "Invitation to a document",
            "templates/document/share.ejs",
            {
                recipientName: user.name,
                senderName: user.name,
                documentLink: `${process.env.BASE_URL}/view/${user._id}`,
            }
        )

        return res.status(404).send("Not Found. Try /api/help")
    },
]
