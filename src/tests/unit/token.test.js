// import jwt from "jsonwebtoken"
// import { signRefreshToken, verifyRefreshToken } from "@utils/token.js"

// process.env.JWT_SECRET = "secret"

// // Mock the jwt methods
// jest.mock("jsonwebtoken", () => ({
//     sign: jest.fn(),
//     verify: jest.fn(),
// }))

describe("Token", () => {
    const payload = { userId: "12345" }
    const token = "fake.jwt.token"

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks()
    })

    describe("temp", () => {
        it.todo("should not be used")
    })

    // describe("signRefreshToken", () => {
    //     it("should sign a token with the correct payload", () => {
    //         // Set up the mock return value for sign
    //         jwt.sign.mockReturnValue(token)

    //         const result = signRefreshToken(payload)

    //         // Check that the sign method was called with the correct arguments
    //         expect(jwt.sign).toHaveBeenCalledWith(
    //             payload,
    //             process.env.JWT_SECRET,
    //             { expiresIn: "30d" }
    //         )
    //         expect(result).toBe(token) // Check that the returned token matches the mocked token
    //     })
    // })

    // it("should return decoded token if verification is successful", async () => {
    //     const decoded = { userId: "12345" }
    //     jwt.verify.mockImplementation((token, secret, callback) => {
    //         callback(null, decoded) // Simulate successful verification
    //     })

    //     const result = await verifyRefreshToken(token) // Await the result

    //     expect(jwt.verify).toHaveBeenCalledWith(
    //         token,
    //         process.env.JWT_SECRET,
    //         expect.any(Function)
    //     )
    //     expect(result).toEqual(decoded) // Check that the decoded value matches
    // })

    // it("should return false if verification fails", async () => {
    //     jwt.verify.mockImplementation((token, secret, callback) => {
    //         callback(new Error("Invalid token"), null) // Simulate failed verification
    //     })

    //     const result = await verifyRefreshToken(token) // Await the result

    //     expect(jwt.verify).toHaveBeenCalledWith(
    //         token,
    //         process.env.JWT_SECRET,
    //         expect.any(Function)
    //     )
    //     expect(result).toBe(false) // Check that the result is false on failure
    // })
})
