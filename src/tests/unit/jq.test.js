import jq from "node-jq"
import { queryJSON, queryString } from "@utils/jq"

// Mock the jq methods
jest.mock("node-jq", () => ({
    run: jest.fn(),
}))

describe("jq", () => {
    const filter = ".name" // Sample jq filter
    const json = { name: "John", age: 30 } // Sample JSON object
    const jsonString = '{"name":"John","age":30}' // Sample JSON string
    const expectedOutput = "John" // Expected output from jq query

    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks()
    })

    describe("queryJSON", () => {
        it("should query JSON object and return the expected result", async () => {
            // Mock the return value for jq.run
            jq.run.mockResolvedValue(expectedOutput)

            const result = await queryJSON(filter, json)

            // Check that jq.run was called with the correct arguments
            expect(jq.run).toHaveBeenCalledWith(filter, json, {
                input: "json",
                output: "pretty",
            })
            expect(result).toBe(expectedOutput) // Check that the returned result matches the expected output
        })

        it("should handle errors from jq.run", async () => {
            // Mock a rejected promise
            jq.run.mockRejectedValue(new Error("JQ Error"))

            await expect(queryJSON(filter, json)).rejects.toThrow("JQ Error")
        })
    })

    describe("queryString", () => {
        it("should query JSON string and return the expected result", async () => {
            // Mock the return value for jq.run
            jq.run.mockResolvedValue(expectedOutput)

            const result = await queryString(filter, jsonString)

            // Check that jq.run was called with the correct arguments
            expect(jq.run).toHaveBeenCalledWith(filter, jsonString, {
                input: "string",
                output: "pretty",
            })
            expect(result).toBe(expectedOutput) // Check that the returned result matches the expected output
        })

        it("should handle errors from jq.run", async () => {
            // Mock a rejected promise
            jq.run.mockRejectedValue(new Error("JQ Error"))

            await expect(queryString(filter, jsonString)).rejects.toThrow(
                "JQ Error"
            )
        })
    })
})
