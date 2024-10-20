import request from "supertest"
import express from "express"
import {
    fetchAllDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    removeDocument,
} from "@/collections/documents.js"

import { get as allRoute } from "@/routes/documents/all.js"
import {
    get as getRoute,
    put as updateRoute,
    del as removeRoute,
} from "@/routes/documents/[id].js"
import { post as createRoute } from "@/routes/documents/create.js"

// Mock the implementation of fetchAllDocuments
jest.mock("@collections/documents.js", () => ({
    fetchAllDocuments: jest.fn(),
    fetchDocument: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    removeDocument: jest.fn(),
}))

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
        app.get("/api/document/all", allRoute)
        app.get("/api/document/:id", getRoute)
        app.put("/api/document/:id", updateRoute)
        app.delete("/api/document/:id", removeRoute)
        app.post("/api/document/create", createRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/document/all", () => {
        it("Should get all documents", async () => {
            fetchAllDocuments.mockResolvedValue(mockDocuments) // Mock a resolved value

            const response = await request(app).get("/api/document/all")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDocuments)
            expect(fetchAllDocuments).toHaveBeenCalledTimes(1)
        })

        it("Should get filtered documents based on title", async () => {
            fetchAllDocuments.mockImplementation(async (filters) => {
                return mockDocuments.filter((doc) =>
                    doc.title.includes(filters.title.$regex)
                )
            })

            const response = await request(app).get(
                "/api/document/all?title=Document 1"
            )
            expect(response.status).toBe(200)
            expect(response.body).toEqual([mockDocuments[0]])
            expect(fetchAllDocuments).toHaveBeenCalledWith(
                { title: { $regex: "Document 1", $options: "i" } },
                {}
            )
        })
    })

    describe("GET /api/document/:id", () => {
        it("Should get a valid document with an ID", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(mockDocuments[0])

            const response = await request(app).get(
                "/api/document/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockDocuments[0])
            expect(fetchDocument).toHaveBeenCalledWith(
                "66eae1c30f6e0282470624c9"
            )
        })

        it("Should return 404, if document not found", async () => {
            // Mock a resolved value
            fetchDocument.mockResolvedValue(null)

            const response = await request(app).get("/api/document/123")
            expect(response.status).toBe(404)
        })

        it("Should return 500, if an error occurs", async () => {
            // Mock a rejected value
            fetchDocument.mockRejectedValue(new Error("Database error"))

            const response = await request(app).get("/api/document/123")

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/document/create", () => {
        it.todo("Should create a document")
    })

    describe("PUT /api/document/:id", () => {
        it.todo("Should update a document")
    })

    describe("DELETE /api/document/:id", () => {
        it.todo("Should delete a document")
    })
})
