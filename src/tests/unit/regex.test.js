import { validateCommentPosition } from "@utils/regex.js"

describe("Regex", () => {
    describe("validateCommentPosition", () => {
        it("Should validate a valid position", () => {
            expect(validateCommentPosition("14:28")).toBe(true)
        })

        it("Should not validate an invalid position", () => {
            expect(validateCommentPosition("invalid")).toBe(false)
        })
    })
})
