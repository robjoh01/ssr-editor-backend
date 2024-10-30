import request from "supertest"
import express from "express"

import { ObjectId } from "mongodb"

import {
    fetchAllUsers,
    fetchUser,
    fetchUserByEmail,
    checkUserExistsByID,
    createUser,
    updateUser,
    removeUser,
} from "@collections/users.js"

import {
    get as getAllUsersRoute,
    post as createUserRoute,
} from "@routes/users/index.js"

import { post as userExistsRoute } from "@routes/users/exists.js"
import { post as fetchUserByEmailRoute } from "@routes/users/find.js"

import {
    get as getUserRoute,
    put as updateUserRoute,
    del as deleteUserRoute,
} from "@routes/users/[id].js"

// Mock the implementation of user-related functions
jest.mock("@collections/users.js", () => ({
    fetchAllUsers: jest.fn(),
    fetchUser: jest.fn(),
    fetchUserByEmail: jest.fn(),
    checkUserExistsByID: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
}))

const mockUser = {
    _id: "66eae0bd0f6e02824705d72a",
    isAdmin: true,
    email: "bYxkM@example.com",
    name: "Robin Johannesson",
}

jest.mock("@middlewares/authenticateJWT.js", () =>
    jest.fn(() => (req, res, next) => {
        req.user = mockUser
        req.isValid = true
        next()
    })
)

describe("User", () => {
    let app
    const mockUsers = [
        {
            _id: "66eae0bd0f6e02824705d72a",
            name: "Robin Johannesson",
            email: "bYxkM@example.com",
            isAdmin: true,
        },
        {
            _id: "66eae0bd0f6e02824705d72b",
            name: "Jane Doe",
            email: "jane@example.com",
            isAdmin: false,
        },
    ]

    beforeAll(async () => {
        app = express()

        // Use json middleware
        app.use(express.json())

        app.get("/api/users", getAllUsersRoute)
        app.post("/api/users", createUserRoute)

        app.get("/api/users/:id", getUserRoute)
        app.put("/api/users/:id", updateUserRoute)
        app.delete("/api/users/:id", deleteUserRoute)

        app.post("/api/users/exists", userExistsRoute)
        app.post("/api/users/find", fetchUserByEmailRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/users", () => {
        it("Should get all users", async () => {
            fetchAllUsers.mockResolvedValue(mockUsers)

            const response = await request(app).get("/api/users")
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockUsers)
            expect(fetchAllUsers).toHaveBeenCalledTimes(1)
        })
    })

    describe("GET /api/users/:id", () => {
        it("Should get a user by ID", async () => {
            fetchUser.mockResolvedValue(mockUsers[0])

            const response = await request(app).get(
                "/api/users/66eae0bd0f6e02824705d72a"
            )
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockUsers[0])
            expect(fetchUser).toHaveBeenCalledWith("66eae0bd0f6e02824705d72a")
        })

        it("Should return 404 if user not found", async () => {
            fetchUser.mockResolvedValue(null)

            const response = await request(app).get("/api/users/invalidId")
            expect(response.status).toBe(404)
        })

        it("Should return 500 if an error occurs", async () => {
            fetchUser.mockRejectedValue(new Error("Database error"))

            const response = await request(app).get(
                "/api/users/66eae0bd0f6e02824705d72a"
            )
            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/users", () => {
        it("Should create a user", async () => {
            const newUser = {
                name: "John Doe",
                email: "john@example.com",
                password: "m#P52s@ap$V",
            }

            // Mock a resolved value
            fetchUser.mockResolvedValue(newUser)

            createUser.mockResolvedValue({
                acknowledged: true,
                insertedId: "66eae0bd0f6e02824705d72a",
            })

            const response = await request(app).post("/api/users").send(newUser)

            expect(response.status).toBe(201)
            expect(response.body).toEqual(newUser)
            expect(createUser).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 for missing required fields", async () => {
            const response = await request(app)
                .post("/api/users")
                .send({ email: "" })
            expect(response.status).toBe(400)
        })

        it("Should return 500 if creation fails", async () => {
            // Mock a resolved value
            fetchUser.mockResolvedValue(mockUsers[0])

            // Mock a rejected value
            createUser.mockRejectedValue(new Error("Database error"))

            const response = await request(app).post("/api/users").send({
                name: "John Doe",
                email: "john@example.com",
                password: "m#P52s@ap$V",
            })

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("PUT /api/users/:id", () => {
        it("Should update a user", async () => {
            const updatedData = { name: "Updated Name" }

            // Mock a resolved value
            fetchUser.mockResolvedValue(mockUsers[0])

            // Mock a resolved value
            updateUser.mockResolvedValue({
                acknowledged: true,
                modifiedCount: 1,
            })

            const response = await request(app)
                .put("/api/users/66eae0bd0f6e02824705d72a")
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "User with ID 66eae0bd0f6e02824705d72a was successfully updated."
            )
            expect(updateUser).toHaveBeenCalledTimes(1)
        })

        it("Should return 404 if user not found", async () => {
            fetchUser.mockResolvedValue(null)

            const response = await request(app)
                .put("/api/users/66eae0bd0f6e02824705d72a")
                .send({ name: "New Name" })
            expect(response.status).toBe(404)
        })

        it("Should return 500 if update fails", async () => {
            fetchUser.mockResolvedValue(mockUsers[0])
            updateUser.mockRejectedValue(new Error("Database error"))

            const response = await request(app)
                .put("/api/users/66eae0bd0f6e02824705d72a")
                .send({ name: "New Name" })

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("DELETE /api/users/:id", () => {
        it("Should delete a user", async () => {
            // Mock a resolved value
            fetchUser.mockResolvedValue(mockUsers[0])

            // Mock a resolved value
            removeUser.mockResolvedValue({
                acknowledged: true,
                deletedCount: 1,
            })

            const response = await request(app).delete(
                "/api/users/66eae0bd0f6e02824705d72b"
            )

            expect(response.status).toBe(200)
            expect(response.text).toBe(
                "User with ID 66eae0bd0f6e02824705d72b was successfully deleted."
            )
            expect(removeUser).toHaveBeenCalledTimes(1)
        })

        it("Should return 403, if user tries to delete their own account", async () => {
            // Mock a resolved value
            fetchUser.mockResolvedValue(mockUsers[0])

            // Mock a resolved value
            removeUser.mockResolvedValue({
                acknowledged: true,
                deletedCount: 1,
            })

            const response = await request(app).delete(
                "/api/users/66eae0bd0f6e02824705d72a"
            )

            expect(response.status).toBe(403)
            expect(response.text).toBe("Forbidden! You cannot delete yourself.")
            expect(removeUser).toHaveBeenCalledTimes(0)
        })

        it("Should return 404 if user not found", async () => {
            // Mock a resolved value
            fetchUser.mockResolvedValue(null)

            const response = await request(app).delete(
                "/api/users/66eae0bd0f6e02824705d72b"
            )

            expect(response.status).toBe(404)
        })

        it("Should return 500 if deletion fails", async () => {
            // Mock a resolved value
            fetchUser.mockResolvedValue(mockUsers[0])

            // Mock a rejected value
            removeUser.mockRejectedValue(new Error("Database error"))

            const response = await request(app).delete(
                "/api/users/66eae0bd0f6e02824705d72b"
            )

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/users/find", () => {
        it("Should find users by email", async () => {
            // Mock a resolved value
            fetchUserByEmail.mockResolvedValue(mockUsers[0])

            const response = await request(app).post("/api/users/find").send({
                email: "bYxkM",
            })

            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockUsers[0])
            expect(fetchUserByEmail).toHaveBeenCalledTimes(1)
        })

        it("Should return 404 if user not found", async () => {
            // Mock a resolved value
            fetchUserByEmail.mockResolvedValue(null)

            const response = await request(app).post("/api/users/find").send({
                email: "bYxkM",
            })

            expect(response.status).toBe(404)
        })
    })

    describe("POST /api/users/exists", () => {
        it("Should check if user exists", async () => {
            // Mock a resolved value
            checkUserExistsByID.mockResolvedValue(true)

            const response = await request(app).post("/api/users/exists").send({
                id: "66eae0bd0f6e02824705d72a",
            })

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                exists: true,
            })
            expect(checkUserExistsByID).toHaveBeenCalledTimes(1)
        })

        it("Should return 200 if user not found", async () => {
            // Mock a resolved value
            checkUserExistsByID.mockResolvedValue(false)

            const response = await request(app).post("/api/users/exists").send({
                id: "66eae0bd0f6e02824705d72a",
            })

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                exists: false,
            })
            expect(checkUserExistsByID).toHaveBeenCalledTimes(1)
        })
    })
})
