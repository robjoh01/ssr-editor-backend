"use strict"

import authenticateJWT from "@/middlewares/authenticateJWT.js"

import validator from "validator"
import { sendEmailWithTemplate } from "@/utils/email.js"

export const post = [
    authenticateJWT(),
    async (req, res) => {
        const { id: documentId } = req.params

        const { user } = req

        const { email } = req.body

        if (!email || !validator.isEmail(email))
            return res.status(400).send("Bad Request. Invalid email.")

        await sendEmailWithTemplate(
            email,
            "",
            "views/shareEmail.ejs",
            (templateData = {
                recipientName: user.name,
                senderName: user.name,
                documentLink: `${process.env.BASE_URL}/view/${user._id}`,
            })
        )

        return res.status(404).send("Not Found. Try /api/help")
    },
]
