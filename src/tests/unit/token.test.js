import jwt from "jsonwebtoken"
import { signToken, verifyToken } from "@utils/token"

// Mock the jwt methods
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}))

describe("Token", () => {
    const payload = { userId: "12345" }
    const token = "fake.jwt.token"

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks()
    })

    describe("signToken", () => {
        it("should sign a token with the correct payload", () => {
            // Set up the mock return value for sign
            jwt.sign.mockReturnValue(token)

            const result = signToken(payload)

            // Check that the sign method was called with the correct arguments
            expect(jwt.sign).toHaveBeenCalledWith(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )
            expect(result).toBe(token) // Check that the returned token matches the mocked token
        })
    })

    it("should return decoded token if verification is successful", async () => {
        const decoded = { userId: "12345" }
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decoded) // Simulate successful verification
        })

        const result = await verifyToken(token) // Await the result

        expect(jwt.verify).toHaveBeenCalledWith(
            token,
            process.env.JWT_SECRET,
            expect.any(Function)
        )
        expect(result).toEqual(decoded) // Check that the decoded value matches
    })

    it("should return false if verification fails", async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null) // Simulate failed verification
        })

        const result = await verifyToken(token) // Await the result

        expect(jwt.verify).toHaveBeenCalledWith(
            token,
            process.env.JWT_SECRET,
            expect.any(Function)
        )
        expect(result).toBe(false) // Check that the result is false on failure
    })
})
