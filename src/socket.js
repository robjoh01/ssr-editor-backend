"use strict"

import { Server } from "socket.io"
import { fetchDocument, updateDocument } from "@collections/documents.js"

export default function initSocket(server) {
    // Attach socket.io to the HTTP server
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust for production
        },
    })

    // Handle socket connections
    io.on("connection", (socket) => {
        console.log(`A user connected (ID: ${socket.id})`)

        // Join a room
        socket.on("join-room", async (documentId) => {
            try {
                const document = await fetchDocument(documentId)
                if (!document) throw new Error("Document not found")

                socket.join(documentId)
                console.log(`User joined room: ${documentId}`)

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
            console.log(`User left room: ${documentId}`)
        })

        socket.on("disconnect", () => {
            console.log("A user disconnected")
        })
    })
}
