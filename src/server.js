"use strict"

import { fileURLToPath } from "url"
import path, { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import "dotenv/config"

import "./utils/database.js"
import passport from "@utils/passport.js"

import express from "express"
import { router } from "express-file-routing"

import { graphqlHTTP } from "express-graphql"
import { makeExecutableSchema } from "@graphql-tools/schema"
import graphqlTypeDefs from "@/utils/graphql/typeDefs.js"
import graphqlResolvers from "@utils/graphql/resolvers.js"

import { createServer } from "node:http"
import initSocket from "./socket.js"

// Express app
const port = process.env.PORT || 1337
const app = express()
const server = createServer(app)

// Initialize socket.io and pass the server
initSocket(server)

// import morgan from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

app.disable("x-powered-by")

app.use(
    cors({
        origin: ["http://localhost:5000", "http://localhost:3000"],
        credentials: true, // Allow credentials (cookies, etc.)
    })
)

// Use cookie-parser middleware
app.use(cookieParser())

// Set up view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views")) // Set views directory

app.use(passport.initialize())

// API routes
app.use(
    "/api/",
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    await router({
        directory: path.join(__dirname, "routes"),
    })
)

import authenticateJWT from "@middlewares/authenticateJWT.js"

// Define the GraphQL endpoint
app.use(
    "/api/graphql",
    authenticateJWT(),
    graphqlHTTP({
        schema: makeExecutableSchema({
            typeDefs: graphqlTypeDefs,
            resolvers: graphqlResolvers,
        }),
        graphiql: true, // Enable GraphiQL UI for testing queries
    })
)

// Start the server
server.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})
