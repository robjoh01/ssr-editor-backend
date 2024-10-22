"use strict"

import ejs from "ejs"
import path from "path"
import validator from "validator"

import FormData from "form-data"
import Mailgun from "mailgun.js"
const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
})

// FIXME: https://www.mailgun.com
// https://www.npmjs.com/package/mailgun.js?utm_source=recordnotfound.com#setup-client

/**
 * Send an email with a specified message.
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message
 * @throws {Error} If email sending fails
 */
export async function sendEmailWithMessage({ to, subject, message }) {
    const fromEmail = process.env.MAILGUN_FROM_EMAIL

    // Validate 'from' email
    if (!fromEmail || !validator.isEmail(fromEmail)) {
        throw new Error("Invalid from email")
    }

    // Validate 'to' email
    if (!to || !validator.isEmail(to)) {
        throw new Error("Invalid to email")
    }

    // Validate subject
    if (!subject || typeof subject !== "string") {
        throw new Error("Subject is required")
    }

    // Prepare email data
    const data = {
        from: fromEmail,
        to,
        subject,
        text: message,
    }

    // Send the email
    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log("Error sending email:", error)
        } else {
            console.log("Email sent successfully:", body)
        }
    })
}

/**
 * Send an email with a specified EJS template.
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.ejsFile - The EJS file to render
 * @param {Object} [options.templateData] - Data to render into the email template
 * @throws {Error} If email sending fails
 */
export async function sendEmailWithTemplate({
    to,
    subject,
    ejsFile,
    templateData,
}) {
    if (!ejsFile) throw new Error("ejsFile is required")

    // Render the EJS template into HTML if an EJS file is provided
    const emailHtml = await ejs.renderFile(
        path.join(__dirname, ejsFile),
        templateData || {}
    )

    // Prepare email data
    const data = {
        from: fromEmail,
        to,
        subject,
        html: emailHtml,
    }

    // Send the email
    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log("Error sending email:", error)
        } else {
            console.log("Email sent successfully:", body)
        }
    })
}
