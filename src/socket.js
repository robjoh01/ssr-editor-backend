"use strict"

import { Server } from "socket.io"
import { fetchDocument, updateDocument } from "@/collections/documents.js"
import { verifyRefreshToken } from "@utils/token.js"
import cookie from "cookie"

function printLog(message) {
    console.log(`[SOCKET.IO, ${new Date().toLocaleTimeString()}] {${message}}`)
}

function printError(message) {
    console.error(
        `[SOCKET.IO, ${new Date().toLocaleTimeString()}, ERROR] {${message}}`
    )
}

export default function initSocket(server) {
    // Attach socket.io to the HTTP server
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5000",
                "http://localhost:3000",
                "http://localhost:1337",
                "https://jsramverk-roje22-fbb8fgbngxgtfzgf.swedencentral-01.azurewebsites.net",
                "https://www.student.bth.se",
                "https://www.student.bth.se/~roje22/editor",
            ],
            credentials: true, // Allow credentials (cookies, etc.)
        },
    })

    io.use((socket, next) => {
        const cookies = socket.request.headers.cookie

        if (!cookies) return next(new Error("No cookies provided"))

        const parsedCookies = cookie.parse(cookies)
        const refreshToken = parsedCookies.refreshToken

        // If the refresh token exists, attempt to validate it
        if (refreshToken) {
            verifyRefreshToken(refreshToken)
                .then((user) => {
                    socket.user = user
                    next()
                })
                .catch((err) => next(err))
        } else {
            return next(new Error("No refresh token provided"))
        }
    })

    // Handle socket connections
    io.on("connection", (socket) => {
        printLog(
            `A user connected (ID: ${socket.id}, email: ${socket.user?.email})`
        )

        // Join a room
        socket.on("join-room", async (documentId) => {
            try {
                const document = await fetchDocument(documentId)
                if (!document) throw new Error("Document not found")

                socket.join(documentId)
                printLog(`User joined room: ${documentId}`)

                // Send the document to the new user
                socket.emit("load-room", document)

                // Track last saved content and timeout
                let saveTimeout = null
                let lastContent = document.content

                // Handle content updates from the client
                socket.on("send-changes", (delta) => {
                    socket.broadcast
                        .to(documentId)
                        .emit("receive-changes", delta, documentId)
                })

                // Broadcast cursor updates to other users in the room
                socket.on("cursor-update", ({ range, userId }) => {
                    socket.broadcast
                        .to(documentId)
                        .emit("cursor-update", { range, userId })
                })

                // Broadcast comment creation to other users in the room
                socket.on("comment-create", ({ range, commentId }) => {
                    console.log(`Comment created: ${commentId} (${range})`)

                    socket.broadcast
                        .to(documentId)
                        .emit("comment-create", { range, commentId })
                })

                // Handle save changes with a cooldown
                socket.on("save-changes", async (content) => {
                    clearTimeout(saveTimeout)

                    saveTimeout = setTimeout(async () => {
                        if (content !== lastContent) {
                            await updateDocument(documentId, { content })
                            lastContent = content // Update last saved content
                        }
                    }, process.env.SAVE_DELAY || 2000)
                })
            } catch (error) {
                console.error(error)
            }
        })

        socket.on("leave-room", (documentId) => {
            socket.leave(documentId)
            printLog(`User left room: ${documentId}`)
        })

        socket.on("disconnect", () => {
            printLog(
                `A user disconnected (ID: ${socket.id}, email: ${socket.user?.email})`
            )
        })
    })
}
