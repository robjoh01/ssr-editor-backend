import bcrypt from "bcryptjs"
import { hashPassword, validatePassword } from "@utils/crypt"

process.env.SALT_ROUNDS = "10" // Set salt rounds for testing

// Mock the bcrypt functions to control their behavior
jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

describe("Crypt", () => {
    beforeEach(() => {
        // Clear all mocks to avoid interference between tests
        jest.clearAllMocks()
    })

    describe("hashPassword", () => {
        it("should hash a password with the specified salt rounds", async () => {
            // Mock bcrypt.hash to return a known hash
            const mockHash = "mockHashedPassword"
            bcrypt.hash.mockResolvedValue(mockHash)

            const password = "myPassword123"
            const hashedPassword = await hashPassword(password)

            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10) // Expect salt rounds to be 10
            expect(hashedPassword).toBe(mockHash) // Check if the returned value is the mock hash
        })

        it("should throw an error if hashing fails", async () => {
            // Mock bcrypt.hash to throw an error
            const mockError = new Error("Hashing failed")
            bcrypt.hash.mockRejectedValue(mockError)

            await expect(hashPassword("somePassword")).rejects.toThrow(
                "Hashing failed"
            )
        })
    })

    describe("validatePassword", () => {
        it("should return true for a correct password", async () => {
            // Mock bcrypt.compare to return true for a matching password
            bcrypt.compare.mockResolvedValue(true)

            const isValid = await validatePassword("password123", "mockHash")
            expect(bcrypt.compare).toHaveBeenCalledWith(
                "password123",
                "mockHash"
            )
            expect(isValid).toBe(true)
        })

        it("should return false for an incorrect password", async () => {
            // Mock bcrypt.compare to return false for a non-matching password
            bcrypt.compare.mockResolvedValue(false)

            const isValid = await validatePassword("wrongPassword", "mockHash")
            expect(bcrypt.compare).toHaveBeenCalledWith(
                "wrongPassword",
                "mockHash"
            )
            expect(isValid).toBe(false)
        })

        it("should throw an error if password validation fails", async () => {
            // Mock bcrypt.compare to throw an error
            const mockError = new Error("Validation failed")
            bcrypt.compare.mockRejectedValue(mockError)

            await expect(
                validatePassword("anyPassword", "anyHash")
            ).rejects.toThrow("Validation failed")
        })
    })
})
