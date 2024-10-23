"use strict"

import ejs from "ejs"
import path from "path"
import validator from "validator"

import FormData from "form-data"
import Mailgun from "mailgun.js"

const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
})

/**
 * Send an email with a specified message.
 * @param {Array<string>} to - Recipient emails
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @throws {Error} If email sending fails
 */
export async function sendEmailWithMessage(to, subject, message) {
    if (!to) throw new Error("To is required")
    if (!Array.isArray(to) || !to.length)
        throw new Error("To must be a non-empty array of emails")
    if (!subject) throw new Error("Subject is required")
    if (!message) throw new Error("Message is required")

    // Validate email addresses
    to.forEach((email) => {
        if (!validator.isEmail(email)) {
            throw new Error(`Invalid email address: ${email}`)
        }
    })

    try {
        // Send the email
        const res = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.MAILGUN_FROM,
            to,
            subject,
            text: message,
        })

        return res.status === 200
    } catch (err) {
        console.error("Error sending email:", err)
        return false
    }
}

/**
 * Send an email with a specified EJS template.
 * @param {Array<string>} to - Recipient emails
 * @param {string} subject - Email subject
 * @param {string} ejsFile - The EJS file to render
 * @param {Object} [templateData] - Data to render into the email template
 * @throws {Error} If email sending fails
 */
export async function sendEmailWithTemplate(
    to,
    subject,
    ejsFile,
    templateData
) {
    if (!to) throw new Error("To is required")
    if (!Array.isArray(to) || !to.length)
        throw new Error("To must be a non-empty array of emails")
    if (!subject) throw new Error("Subject is required")
    if (!ejsFile) throw new Error("EJS file is required")

    // Validate email addresses
    to.forEach((email) => {
        if (!validator.isEmail(email)) {
            throw new Error(`Invalid email address: ${email}`)
        }
    })

    const ejsFilePath = path.join(process.cwd(), "src", "views", ejsFile)

    try {
        // Render the EJS template into HTML
        const emailHtml = await ejs.renderFile(ejsFilePath, templateData || {})

        // Send the email using Mailgun
        const res = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.MAILGUN_FROM,
            to,
            subject,
            html: emailHtml,
        })

        return res.status === 200
    } catch (err) {
        console.error("Error sending email:", err)
        return false
    }
}
