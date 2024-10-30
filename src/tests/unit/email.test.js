import { sendEmailWithMessage, sendEmailWithTemplate } from "@utils/email.js"

import Mailgun from "mailgun.js"
import FormData from "form-data"
import ejs from "ejs"
import path from "path"
import validator from "validator"

// Mock Mailgun, FormData, and necessary imports
jest.mock("mailgun.js", () => {
    const mailgun = {
        client: jest.fn(() => ({
            messages: {
                create: jest.fn(() => Promise.resolve({ status: 200 })),
            },
        })),
    }

    return jest.fn(() => mailgun)
})

jest.mock("form-data", () => jest.fn())
jest.mock("ejs")
jest.mock("validator", () => ({
    isEmail: jest.fn(),
}))

describe("Email Utility Functions", () => {
    let mg

    beforeEach(() => {
        jest.clearAllMocks()
        mg = new Mailgun().client()
    })

    describe("sendEmailWithMessage", () => {
        it("should send an email successfully with valid input", async () => {
            validator.isEmail.mockReturnValue(true)

            const to = ["test1@example.com"]
            const subject = "Test Subject"
            const message = "Test Message"

            const result = await sendEmailWithMessage(to, subject, message)
            expect(result).toBe(true)
        })

        it("should throw an error if 'to' parameter is missing", async () => {
            await expect(
                sendEmailWithMessage(null, "Subject", "Message")
            ).rejects.toThrow("To is required")
        })

        it("should throw an error if an invalid email is provided", async () => {
            validator.isEmail.mockReturnValue(false)
            const to = ["invalid-email"]
            await expect(
                sendEmailWithMessage(to, "Subject", "Message")
            ).rejects.toThrow("Invalid email address: invalid-email")
        })

        // it("should return false if email sending fails", async () => {
        //     mg.messages.create.mockRejectedValue(new Error("API error"))
        //     validator.isEmail.mockReturnValue(true)

        //     const to = ["test@example.com"]
        //     const result = await sendEmailWithMessage(to, "Subject", "Message")

        //     expect(result).toBe(false)
        //     expect(mg.messages.create).toHaveBeenCalled()
        // })
    })

    describe("sendEmailWithTemplate", () => {
        const to = ["test1@example.com"]
        const subject = "Test Subject"
        const ejsFile = "test-template.ejs"
        const templateData = { name: "User" }

        beforeEach(() => {
            ejs.renderFile.mockResolvedValue("<h1>Hello, User</h1>")
            validator.isEmail.mockReturnValue(true)
        })

        it("should send an email with an EJS template successfully", async () => {
            mg.messages.create.mockResolvedValue({ status: 200 })

            const result = await sendEmailWithTemplate(
                to,
                subject,
                ejsFile,
                templateData
            )

            expect(result).toBe(true)
            expect(ejs.renderFile).toHaveBeenCalledWith(
                path.join(process.cwd(), "src", "views", ejsFile),
                templateData
            )
        })

        it("should throw an error if 'ejsFile' parameter is missing", async () => {
            await expect(sendEmailWithTemplate(to, subject)).rejects.toThrow(
                "EJS file is required"
            )
        })

        // it("should return false if template rendering fails", async () => {
        //     ejs.renderFile.mockRejectedValue(new Error("Rendering error"))

        //     const result = await sendEmailWithTemplate(
        //         to,
        //         subject,
        //         ejsFile,
        //         templateData
        //     )

        //     expect(result).toBe(false)
        // })

        // it("should return false if email sending fails", async () => {
        //     mg.messages.create.mockRejectedValue(new Error("API error"))
        //     const result = await sendEmailWithTemplate(
        //         to,
        //         subject,
        //         ejsFile,
        //         templateData
        //     )

        //     expect(result).toBe(false)
        //     expect(mg.messages.create).toHaveBeenCalled()
        // })
    })
})
