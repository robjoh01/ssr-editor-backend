import request from "supertest"
import express from "express"
import cookieParser from "cookie-parser"

import { validatePassword, hashPassword } from "@utils/crypt.js"
import {
    signAccountToken,
    verifyAccountToken,
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    generateTokens,
} from "@utils/token.js"
import { fetchUserByEmail, updateUserLastLogin } from "@collections/users.js"

import { post as loginRoute } from "@routes/auth/login.js"
import { post as logoutRoute } from "@routes/auth/logout.js"
import { post as refreshRoute } from "@routes/auth/refresh.js"

// import {
//     get as getMyselfRoute,
//     put as putMyselfRoute,
//     del as delMyselfRoute,
// } from "@routes/auth/myself.js"

// import { post as signUpRoute } from "@routes/auth/signUp/index.js"
// import { post as signUpCompleteRoute } from "@routes/auth/signUp/complete.js"
// import { post as signUpVerifyRoute } from "@routes/auth/signUp/verify.js"

jest.mock("@collections/users.js", () => ({
    fetchUserByEmail: jest.fn(),
    updateUserLastLogin: jest.fn(),
}))

jest.mock("@utils/token.js", () => ({
    signAccountToken: jest.fn(),
    verifyAccountToken: jest.fn(),
    signAccessToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    generateTokens: jest.fn(),
}))

const loggedInUser = {
    _id: "66eae0bd0f6e02824705d72a",
    email: "test@example.com",
    name: "Test User",
    passwordHash:
        "$2a$12$fI7ELlrodWaUIo2aLAbV6.E01w2zLwaNnhj/mDgJupXoV/nWoj2K6",
}

jest.mock("@middlewares/authenticateJWT.js", () =>
    jest.fn(() => (req, res, next) => {
        req.user = loggedInUser
        req.isValid = true
        req.accessToken = "xxx"
        req.cookies = { refreshToken: "xxx" }
        req.clearCookie = jest.fn()
        next()
    })
)

describe("Auth API Routes", () => {
    let app

    let mockUser = {
        _id: "66eae0bd0f6e02824705d72a",
        email: "test@example.com",
        name: "Test User",
    }

    beforeAll(async () => {
        mockUser.passwordHash = await hashPassword("m#P52s@ap$V")

        app = express()

        // Use json middleware
        app.use(express.json())

        // Use cookie-parser middleware
        app.use(cookieParser())

        app.post("/api/auth/login", loginRoute)
        app.post("/api/auth/logout", logoutRoute)
        app.post("/api/auth/refresh", refreshRoute)

        // app.get("/api/auth/myself", getMyselfRoute)
        // app.put("/api/auth/myself", putMyselfRoute)
        // app.delete("/api/auth/myself", delMyselfRoute)

        // app.post("/api/auth/signup", signUpRoute)
        // app.post("/api/auth/signup/complete", signUpCompleteRoute)
        // app.post("/api/auth/signup/verify", signUpVerifyRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("POST /api/auth/login", () => {
        it("Should log in user and return token", async () => {
            fetchUserByEmail.mockReturnValue(mockUser)
            updateUserLastLogin.mockResolvedValue(true)
            generateTokens.mockReturnValue({ accessToken: "fakeToken" })

            const response = await request(app).post("/api/auth/login").send({
                email: mockUser.email,
                // gitguardian:ignore
                password: process.env.TEST_PASSWORD,
            })

            expect(response.status).toBe(200)
            expect(response.body.token).not.toBe(null)
            expect(response.body.user).toEqual(mockUser)
            expect(fetchUserByEmail).toHaveBeenCalledTimes(1)
        })

        it("Should return 401, if login data is missing", async () => {
            const response = await request(app).post("/api/auth/login").send({})

            expect(response.status).toBe(401)
        })

        it("Should return 500 on login failure", async () => {
            // Resolve with a rejected value
            fetchUserByEmail.mockRejectedValue(new Error("Database error"))

            const response = await request(app).post("/api/auth/login").send({
                email: mockUser.email,
                // gitguardian:ignore
                password: process.env.TEST_PASSWORD,
            })

            expect(response.status).toBe(500)
            expect(response.text).toBe("Internal Server Error")
        })
    })

    describe("POST /api/auth/logout", () => {
        it("Should log out user successfully", async () => {
            const response = await request(app).post("/api/auth/logout")

            expect(response.status).toBe(200)
            expect(response.text).toBe("Logout successful")
        })
    })

    describe("POST /api/auth/refresh", () => {
        it("Should refresh access token", async () => {
            verifyRefreshToken.mockReturnValue({
                _id: "66eae0bd0f6e02824705d72a",
                email: "test@example.com",
                isAdmin: false,
            })

            signAccessToken.mockReturnValue("newFakeToken")

            const response = await request(app)
                .post("/api/auth/refresh")
                .set("Cookie", "refreshToken=fakeRefreshToken")

            expect(response.status).toBe(200)
            expect(response.body).toMatchObject({
                accessToken: "newFakeToken",
            })
            expect(verifyRefreshToken).toHaveBeenCalledTimes(1)
            expect(signAccessToken).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 if token refresh fails", async () => {
            const response = await request(app).post("/api/auth/refresh")
            expect(response.status).toBe(400)
            expect(response.text).toBe("Refresh token not provided")
        })
    })
})
