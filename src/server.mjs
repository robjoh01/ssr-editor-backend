"use strict"

import { createServer } from "node:http"
import { Server } from "socket.io"

import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import "dotenv/config"
import "./utils/database.js"
import { router } from "express-file-routing"

// Express app
const port = process.env.PORT || 1337
const app = express()

// Create HTTP server using node:http
const server = createServer(app)

// Attach socket.io to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust for production if necessary
    },
})

let timeout

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`A user connected (ID: ${socket.id})`)

    socket.on("content", (data) => {
        console.log(data)
        io.emit("content", data) // Broadcast data to all clients
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            console.log("Save data")
        }, process.env.SAVE_DELAY)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })
})

app.disable("x-powered-by")
app.use(cors())

// Set up view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views")) // Set views directory

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
app.use("/api/", await router())

// Start the server
server.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})
