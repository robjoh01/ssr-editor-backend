import request from "supertest"
import express from "express"
import {
    fetchAllComments,
    fetchComment,
    createComment,
    updateComment,
    removeComment,
} from "@collections/comments.js"

import {
    get as getAllCommentsRoute,
    post as createCommentRoute,
} from "@routes/comments/index.js"

import {
    get as getCommentRoute,
    put as updateCommentRoute,
    del as deleteCommentRoute,
} from "@routes/comments/[id].js"

// Mock the implementation of fetchAllComments
jest.mock("@collections/comments.js", () => ({
    fetchAllComments: jest.fn(),
    fetchComment: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn(),
    removeComment: jest.fn(),
}))

const mockUser = {
    _id: "66eae0bd0f6e02824705d72a",
    isAdmin: true,
    email: "bYxkM@example.com",
    name: "John Doe",
}

jest.mock("@middlewares/authenticateJWT.js", () =>
    jest.fn(() => (req, res, next) => {
        req.user = mockUser
        req.isValid = true
        next()
    })
)

describe("Comment", () => {
    let app
    const mockComments = [
        {
            _id: "66eae1c30f6e0282470624c9",
            position: "10:10",
            content: "Sample comment 1",
            documentId: "66eae1c30f6e0282470624c2",
            userId: "66eae0bd0f6e02824705d72a",
        },
        {
            _id: "66eae0bd0f6e02824705d72c",
            position: "15:5",
            content: "Sample comment 2",
            documentId: "66eae1c30f6e0282470624c3",
            userId: "66eae0bd0f6e02824705d72b",
        },
    ]

    beforeAll(async () => {
        app = express()

        // Use json middleware
        app.use(express.json())

        app.get("/api/comments", getAllCommentsRoute)
        app.post("/api/comments", createCommentRoute)

        app.get("/api/comments/:id", getCommentRoute)
        app.put("/api/comments/:id", updateCommentRoute)
        app.delete("/api/comments/:id", deleteCommentRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/comments", () => {
        it("Should get all comments", async () => {
            fetchAllComments.mockResolvedValue(mockComments)

            const response = await request(app).get("/api/comments")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockComments)
            expect(fetchAllComments).toHaveBeenCalledTimes(1)
        })
    })

    describe("GET /api/comments/:id", () => {
        it("Should get a comment by ID", async () => {
            fetchComment.mockResolvedValue(mockComments[0])

            const response = await request(app).get(
                "/api/comments/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockComments[0])
            expect(fetchComment).toHaveBeenCalledWith(
                "66eae1c30f6e0282470624c9"
            )
        })

        it("Should return 404 if comment not found", async () => {
            fetchComment.mockResolvedValue(null)

            const response = await request(app).get("/api/comments/invalidId")
            expect(response.status).toBe(404)
        })

        it("Should return 500 if an error occurs", async () => {
            fetchComment.mockRejectedValue(new Error("Database error"))

            const response = await request(app).get(
                "/api/comments/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/comments", () => {
        it("Should create a comment", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            // Mock a resolved value
            createComment.mockResolvedValue({
                acknowledged: true,
                insertedId: "66eae1c30f6e0282470624c9",
            })

            const response = await request(app).post("/api/comments").send({
                position: mockComments[0].position,
                content: mockComments[0].content,
                documentId: mockComments[0].documentId,
                userId: mockComments[0].userId,
            })

            expect(response.status).toBe(201)
            expect(response.body).toEqual(mockComments[0])
            expect(createComment).toHaveBeenCalledTimes(1)
        })

        it("Should not create a comment without position", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            const response = await request(app).post("/api/comments").send({
                content: "New comment",
            })

            expect(response.status).toBe(400)
        })

        it("Should not create a comment without content", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            const response = await request(app).post("/api/comments").send({
                position: "10:10",
            })
            expect(response.status).toBe(400)
        })

        it("Should return 500 if creation fails", async () => {
            // Mock a rejected value
            createComment.mockRejectedValue(new Error("Database error"))

            const response = await request(app).post("/api/comments").send({
                position: "10:10",
                content: "New comment",
                documentId: "66eae1c30f6e0282470624c9",
                userId: "66eae0bd0f6e02824705d72b",
            })
            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("PUT /api/comments/:id", () => {
        const updatedData = { content: "Updated comment content" }

        it("Should update a comment", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            // Mock a resolved value
            updateComment.mockResolvedValue({
                acknowledged: true,
                insertedId: "66eae1c30f6e0282470624c9",
            })

            const response = await request(app)
                .put("/api/comments/66eae1c30f6e0282470624c9")
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "Comment with ID 66eae1c30f6e0282470624c9 was successfully updated."
            )
            expect(updateComment).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 for invalid comment ID", async () => {
            const response = await request(app)
                .put("/api/comments/invalidId")
                .send(updatedData)

            expect(response.status).toBe(400)
        })

        it("Should return 404 for comment not found", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(null)

            const response = await request(app)
                .put("/api/comments/66eae1c30f6e0282470624c9")
                .send(updatedData)

            expect(response.status).toBe(404)
        })

        it("Should return 500 if update fails", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            // Mock a rejected value
            updateComment.mockRejectedValue(new Error("Database error"))

            const response = await request(app)
                .put("/api/comments/66eae1c30f6e0282470624c9")
                .send(updatedData)

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("DELETE /api/comments/:id", () => {
        it("Should delete a comment", async () => {
            // Mock a resolved value
            removeComment.mockResolvedValue({
                acknowledged: true,
                deletedCount: 1,
            })

            const response = await request(app).delete(
                "/api/comments/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "Comment with ID 66eae1c30f6e0282470624c9 was successfully deleted."
            )
            expect(removeComment).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 if comment ID is invalid", async () => {
            const response = await request(app).delete(
                "/api/comments/invalidId"
            )
            expect(response.status).toBe(400)
        })

        it("Should return 404 if comment not found", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(null)

            const response = await request(app).delete(
                "/api/comments/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(404)
        })

        it("Should return 500 if deletion fails", async () => {
            // Mock a resolved value
            fetchComment.mockResolvedValue(mockComments[0])

            // Mock a rejected value
            removeComment.mockRejectedValue(new Error("Database error"))

            const response = await request(app).delete(
                "/api/comments/66eae1c30f6e0282470624c9"
            )
            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })
})
