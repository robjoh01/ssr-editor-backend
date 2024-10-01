"use strict"

import "dotenv/config"

import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"

import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import "./database.mjs"

import { router } from "express-file-routing"

// Express server
const port = process.env.PORT || 1337
const app = express()

app.disable("x-powered-by")
app.use(cors())

// Set the view engine to EJS (or any template engine you're using)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views")) // Set the views directory

// don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    // use morgan to log at command line
    app.use(morgan("combined")) // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/", await router())

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})
