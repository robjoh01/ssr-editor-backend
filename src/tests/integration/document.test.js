import request from "supertest"
import express from "express"
import {
    fetchAllDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    removeDocument,
} from "@collections/documents.js"

import {
    get as getsRoute,
    post as createRoute,
} from "@routes/documents/index.js"

import {
    get as getRoute,
    put as updateRoute,
    del as removeRoute,
} from "@routes/documents/[id]/index.js"

import { post as commentRoute } from "@routes/documents/[id]/comment.js"
import { post as shareRoute } from "@routes/documents/[id]/share.js"
import { del as deleteRoute } from "@routes/documents/[id]/delete.js"

// Mock the implementation of fetchAllDocuments
jest.mock("@collections/documents.js", () => ({
    fetchAllDocuments: jest.fn(),
    fetchDocument: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    removeDocument: jest.fn(),
}))

const mockUser = {
    _id: "66eae0bd0f6e02824705d72a",
    isAdmin: true,
    email: "bYxkM@example.com",
    name: "Robin Johannesson",
    stats: {
        totalDocuments: 1,
        totalEdits: 5,
        totalComments: 1,
    },
    createdAt: "2017-10-31T02:15:00+02:00",
    updatedAt: "2017-10-31T02:15:00+02:00",
    lastLogin: "2024-10-30T15:06:30.569Z",
    profilePicture: "url_to_profile_pic_1",
}

jest.mock("@middlewares/authenticateJWT.js", () =>
    jest.fn(() => (req, res, next) => {
        req.user = mockUser
        req.isValid = true
        next()
    })
)

describe("Document", () => {
    let app
    const mockDocuments = [
        {
            _id: "66eae1c30f6e0282470624c9",
            title: "Document 1",
            content: "Lorem ipsum",
            shared: true,
        },
        {
            _id: "66eae0bd0f6e02824705d72c",
            title: "Document 2",
            content: "Dolor sit amet",
            shared: false,
        },
    ]

    beforeAll(async () => {
        app = express()

        // Use json middleware
        app.use(express.json())

        app.get("/api/documents", getsRoute)
        app.post("/api/documents", createRoute)

        app.get("/api/documents/:id", getRoute)
        app.put("/api/documents/:id", updateRoute)
        app.delete("/api/documents/:id", removeRoute)

        app.post("/api/documents/:id/comment", commentRoute)
        app.post("/api/documents/:id/share", shareRoute)
        app.delete("/api/documents/:id/delete", deleteRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/documents", () => {
        it("Should get all documents", async () => {
            fetchAllDocuments.mockResolvedValue(mockDocuments) // Mock a resolved value

            const response = await request(app).get("/api/documents")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDocuments)
            expect(fetchAllDocuments).toHaveBeenCalledTimes(1)
        })
    })

    describe("GET /api/documents/:id", () => {
        it("Should get a valid document with an ID", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            const response = await request(app).get(
                "/api/documents/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDocuments[0])
            expect(fetchDocument).toHaveBeenCalledWith(
                "66eae1c30f6e0282470624c9"
            )
        })

        it("Should return 400, if document ID is invalid", async () => {
            const response = await request(app).get("/api/documents/123")
            expect(response.status).toBe(400)
        })

        it("Should return 404, if document not found", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(null)

            const response = await request(app).get(
                "/api/documents/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(404)
        })

        it("Should return 500, if an error occurs", async () => {
            // Mock a rejected value
            fetchDocument.mockRejectedValue(new Error("Database error"))

            const response = await request(app).get(
                "/api/documents/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/documents", () => {
        it("Should create a document", async () => {
            const newDocument = {
                title: "New Document",
            }

            // Mock a resolved value
            fetchDocument.mockResolvedValue({
                _id: "66eae1c30f6e0282470624c9",
                ...newDocument,
            })

            // Mock a resolved value
            createDocument.mockResolvedValue({
                acknowledged: true,
                insertedId: "66eae1c30f6e0282470624c9",
            })

            const response = await request(app)
                .post("/api/documents")
                .send(newDocument)

            expect(response.status).toBe(201)
            expect(response.body).toEqual({
                _id: "66eae1c30f6e0282470624c9",
                ...newDocument,
            })
            expect(createDocument).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 for invalid input", async () => {
            const invalidDocument = { title: "", content: "" }

            const response = await request(app)
                .post("/api/documents")
                .send(invalidDocument)
            expect(response.status).toBe(400)
        })

        it("Should return 500 if creation fails", async () => {
            createDocument.mockRejectedValue(new Error("Database error"))

            const response = await request(app).post("/api/documents").send({
                title: "New Document",
                content: "Sample content",
                shared: true,
            })

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("PUT /api/documents/:id", () => {
        it("Should update a document", async () => {
            const updatedData = {
                title: "Updated Title",
                content: "Updated Content",
            }

            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            // Mock a resolved value
            updateDocument.mockResolvedValue({
                acknowledged: true,
                modifiedCount: 1,
            })

            const response = await request(app)
                .put("/api/documents/66eae1c30f6e0282470624c9")
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "Document with ID 66eae1c30f6e0282470624c9 was successfully updated."
            )
            expect(updateDocument).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 for invalid document ID", async () => {
            const response = await request(app)
                .put("/api/documents/invalidId")
                .send({
                    title: "Title",
                    content: "Content",
                })
            expect(response.status).toBe(400)
        })

        it("Should return 404 for document not found", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(null)

            const response = await request(app)
                .put("/api/documents/66eae1c30f6e0282470624c9")
                .send({
                    title: "Title",
                    content: "Content",
                })
            expect(response.status).toBe(404)
        })

        it("Should return 500 if update fails", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            // Mock a rejected value
            updateDocument.mockRejectedValue(new Error("Database error"))

            const response = await request(app)
                .put("/api/documents/66eae1c30f6e0282470624c9")
                .send({ title: "Title", content: "Content" })

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("DELETE /api/documents/:id", () => {
        it("Should delete a document", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            // Mock a resolved value
            removeDocument.mockResolvedValue({
                acknowledged: true,
                deletedCount: 1,
            })

            const response = await request(app).delete(
                "/api/documents/66eae1c30f6e0282470624c9"
            )

            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "Document with ID 66eae1c30f6e0282470624c9 was successfully deleted."
            )
            expect(removeDocument).toHaveBeenCalledWith(
                "66eae1c30f6e0282470624c9"
            )
        })

        it("Should return 400 if document ID is invalid", async () => {
            const response = await request(app).delete(
                "/api/documents/invalidId"
            )

            expect(response.status).toBe(400)
        })

        it("Should return 404 if document not found", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(null)

            const response = await request(app).delete(
                "/api/documents/66eae1c30f6e0282470624c9"
            )

            expect(response.status).toBe(404)
        })

        it("Should return 500 if deletion fails", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            // Mock a rejected value
            removeDocument.mockRejectedValue(new Error("Database error"))

            const response = await request(app).delete(
                "/api/documents/66eae1c30f6e0282470624c9"
            )

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/documents/:id/comment", () => {
        it.todo("Should add a comment to a document")
    })

    describe("POST /api/documents/:id/share", () => {
        it.todo("Should share a document")
    })

    describe("DELETE /api/documents/:id/delete", () => {
        it.todo("Should delete a document")
    })
})
