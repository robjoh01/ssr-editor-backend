const mockingoose = require("mockingoose")

import { ObjectId } from "mongodb"
import Comment from "../models/comment.js"

describe("Comment", () => {
    beforeEach(() => {
        mockingoose.resetAll()
    })

    describe("GET /api/comment/all", () => {
        it.todo("Should get all comments")
    })

    describe("GET /api/comment/:id", () => {
        it.todo("Should get a comment")
    })

    describe("POST /api/comment/:id", () => {
        it.todo("Should create a comment")
        it.todo("Should not create a comment without position")
        it.todo("Should not create a comment without content")
    })

    describe("PUT /api/comment/:id", () => {
        it.todo("Should update a comment")
    })

    describe("DELETE /api/comment/:id", () => {
        it.todo("Should delete a comment")
    })
})
