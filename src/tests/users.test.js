const mockingoose = require("mockingoose")

import { ObjectId } from "mongodb"
import User from "../models/user.js"

describe("User", () => {
    beforeEach(() => {
        mockingoose.resetAll()
    })

    describe("GET /api/user/all", () => {
        it.todo("Should get all user")
    })

    describe("GET /api/user/:id", () => {
        it.todo("Should get a user")
    })

    describe("POST /api/user/:id", () => {
        it.todo("Should create a user")
    })

    describe("PUT /api/user/:id", () => {
        it.todo("Should update a user")
    })

    describe("DELETE /api/user/:id", () => {
        it.todo("Should delete a user")
    })

    describe("GET /api/user/validate/:id?password=password", () => {
        it.todo("Should validate a user")
    })
})
