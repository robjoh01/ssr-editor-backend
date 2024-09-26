"use strict"

process.env.NODE_ENV = "test"

// TODO: Add test cases for creating, reading, updating and removing documents

// TODO: Use chai, mocking and ...

import { should } from "chai" // Using Assert style
import chaiHttp from "chai-http" // Using chai-http

import server from "./server.mjs"
import database from "./database.mjs"

chai.use(chaiHttp)

describe("", () => {
    before(async () => {
        const db = await database.getInstance()

        // Reset the database
    })

    describe("GET /api/document/all", () => {
        it("", (done) => {
            // chai.request(server)
            //     .post("/api/document/create")
            //     .send(user)
            //     .end((err, res) => {
            //         res.should.have.status(200)
            //         res.body.should.be.an("object")
            //         res.body.should.have.property("data")
            //         res.body.data.should.have.property("message")
            //         res.body.data.message.should.equal("Document created.")
            //         done()
            //     })
        })
    })

    describe("GET /api/document/:id", () => {
        second
    })

    describe("POST /api/document/create", () => {
        second
    })

    describe("PUT /api/document/:id", () => {
        second
    })

    describe("DELETE /api/document/:id", () => {
        second
    })
})
