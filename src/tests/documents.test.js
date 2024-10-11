const mockingoose = require("mockingoose")

import { ObjectId } from "mongodb"
import Document from "../models/document.js"

describe("Document", () => {
    beforeEach(() => {
        mockingoose.resetAll()
    })

    describe("GET /api/document/all", () => {
        it.todo("Should get all documents")
    })

    describe("GET /api/document/:id", () => {
        it.todo("Should get a document")
    })

    describe("POST /api/document/:id", () => {
        it.todo("Should create a document")
    })

    describe("PUT /api/document/:id", () => {
        it.todo("Should update a document")
    })

    describe("DELETE /api/document/:id", () => {
        it.todo("Should delete a document")
    })
})
