import request from "supertest"
import express from "express"

import {
    get as getRoute,
    post as postRoute,
    put as putRoute,
    del as delRoute,
} from "@routes/[...catchall].js"

describe("Misc", () => {
    beforeAll(async () => {
        app = express()

        // Use json middleware
        app.use(express.json())

        app.get("/api/xxx", getRoute)
        app.post("/api/xxx", postRoute)
        app.put("/api/xxx", putRoute)
        app.delete("/api/xxx", delRoute)
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/xxx", () => {
        it("Should return 404", async () => {
            const res = await request(app).get("/api/xxx")

            expect(res.status).toBe(404)
            expect(res.text).toBe("Endpoint not found")
        })
    })

    describe("POST /api/xxx", () => {
        it("Should return 404", async () => {
            const res = await request(app).post("/api/xxx")

            expect(res.status).toBe(404)
            expect(res.text).toBe("Endpoint not found")
        })
    })

    describe("PUT /api/xxx", () => {
        it("Should return 404", async () => {
            const res = await request(app).put("/api/xxx")

            expect(res.status).toBe(404)
            expect(res.text).toBe("Endpoint not found")
        })
    })

    describe("DELETE /api/xxx", () => {
        it("Should return 404", async () => {
            const res = await request(app).delete("/api/xxx")

            expect(res.status).toBe(404)
            expect(res.text).toBe("Endpoint not found")
        })
    })
})
