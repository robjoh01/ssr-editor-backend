// import { ObjectId } from "mongodb"

import request from "supertest"
import express from "express"

describe("User", () => {
    describe("GET /api/user/all", () => {
        it.todo("Should get all users")
    })

    describe("GET /api/user/:id", () => {
        it.todo("Should get a user")

        // const spy = jest.spyOn(User, "find")
        // spy.mockImplementation(mockUser)

        // expect(spy).toHaveBeenCalled()
        // spy.mockRestore()
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
