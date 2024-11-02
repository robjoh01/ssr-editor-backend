import { sendEmailWithMessage, sendEmailWithTemplate } from "@utils/email.js"

import Mailgun from "mailgun.js"

import FormData from "form-data"
import ejs from "ejs"
import path from "path"
import validator from "validator"

// Mock Mailgun and its Client
jest.mock("mailgun.js", () => {
    const clientMock = {
        messages: {
            create: jest.fn(),
        },
    }

    return {
        __esModule: true,
        default: jest.fn(() => ({
            client: jest.fn(() => clientMock),
        })),
    }
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
            mg.messages.create.mockReturnValue({ status: 200 })
            validator.isEmail.mockReturnValue(true)

            const to = ["test1@example.com"]
            const subject = "Test Subject"
            const message = "Test Message"

            const result = await sendEmailWithMessage(to, subject, message)
            expect(result).toBe(true)
        })

        it("should have correct parameters", async () => {
            await expect(
                sendEmailWithMessage(null, "Subject", "Message")
            ).rejects.toThrow("To is required")

            await expect(
                sendEmailWithMessage("test", "Subject", "Message")
            ).rejects.toThrow("To must be a non-empty array of emails")

            const to = ["invalid-email"]

            await expect(
                sendEmailWithMessage(to, null, "Message")
            ).rejects.toThrow("Subject is required")

            await expect(
                sendEmailWithMessage(to, "Subject", null)
            ).rejects.toThrow("Message is required")

            validator.isEmail.mockReturnValue(false)

            await expect(
                sendEmailWithMessage(to, "Subject", "Message")
            ).rejects.toThrow("Invalid email address: invalid-email")
        })

        it("should return false if email sending fails", async () => {
            // Disable console.error
            jest.spyOn(console, "error").mockImplementation(jest.fn())

            // Mock a rejected value
            mg.messages.create.mockRejectedValue(new Error("API error"))

            validator.isEmail.mockReturnValue(true)

            const to = ["test@example.com"]
            const result = await sendEmailWithMessage(to, "Subject", "Message")

            expect(result).toBe(false)
            expect(mg.messages.create).toHaveBeenCalledTimes(1)
        })
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

        it("should have correct parameters", async () => {
            const ejsFile = "test-template.ejs"

            await expect(
                sendEmailWithTemplate(null, "Subject", ejsFile)
            ).rejects.toThrow("To is required")

            await expect(
                sendEmailWithTemplate("test", "Subject", ejsFile)
            ).rejects.toThrow("To must be a non-empty array of emails")

            const to = ["invalid-email"]

            await expect(
                sendEmailWithTemplate(to, null, ejsFile)
            ).rejects.toThrow("Subject is required")

            await expect(
                sendEmailWithTemplate(to, "Subject", null)
            ).rejects.toThrow("EJS file is required")

            validator.isEmail.mockReturnValue(false)

            await expect(
                sendEmailWithTemplate(to, "Subject", ejsFile)
            ).rejects.toThrow("Invalid email address: invalid-email")
        })

        it("should return false if template rendering fails", async () => {
            ejs.renderFile.mockRejectedValue(new Error("Rendering error"))

            const result = await sendEmailWithTemplate(
                to,
                subject,
                ejsFile,
                templateData
            )

            expect(result).toBe(false)
        })

        it("should return false if email sending fails", async () => {
            // Disable console.error
            jest.spyOn(console, "error").mockImplementation(jest.fn())

            // Mock a rejected value
            mg.messages.create.mockRejectedValue(new Error("API error"))

            const result = await sendEmailWithTemplate(
                to,
                subject,
                ejsFile,
                templateData
            )

            expect(result).toBe(false)
            expect(mg.messages.create).toHaveBeenCalledTimes(1)
        })
    })
})
