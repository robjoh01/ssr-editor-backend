"use strict"

/* eslint-disable */

import { Server } from "socket.io"
import { fetchDocument, updateDocument } from "@collections/documents.js"
import { createComment } from "@collections/comments.js"

import { verifyRefreshToken } from "@utils/token.js"
import cookie from "cookie"
import uniqolor from "uniqolor"

function printLog(message) {
    console.log(`[Socket.io, ${new Date().toLocaleTimeString()}] ${message}`)
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

    const rooms = {} // To track users in rooms
    const socketToRoomMap = {} // To map socket IDs to document IDs and user info

    // Handle socket connections
    io.on("connection", (socket) => {
        printLog(`A user connected (ID: ${socket.id})`)

        // Join a room
        socket.on("join_room", async (documentId, user) => {
            const document = await fetchDocument(documentId)

            if (!document) {
                socket.emit("error", "Document not found")
                return
            }

            if (!user) {
                socket.emit("error", "User not found")
                return
            }

            // Check if the user is the owner or a collaborator
            const isOwner = document.ownerId.equals(user._id)
            const collaborator = document.collaborators.find((collab) =>
                collab.userId.equals(user._id)
            )

            // If the user is neither the owner nor a collaborator, throw an error
            if (!isOwner && !collaborator) {
                socket.emit("error", "Access denied")
                return
            }

            // Export the canWrite flag if the user is a collaborator
            user.canWrite = collaborator ? collaborator.canWrite : true

            // Ensure the room exists
            if (!rooms[documentId]) {
                rooms[documentId] = []
            }

            // Add the user to the room's user list
            rooms[documentId].push(user)

            // Join the room
            socket.join(documentId)

            // Map socket ID to the room and user info
            socketToRoomMap[socket.id] = { documentId, user }

            // Notify other users about the user joining
            io.to(documentId).emit("users_changed", rooms[documentId])

            // Send the current document to the newly joined user
            socket.emit("load_room", document)

            // Callback for cursor changes
            socket.on("cursor_pending", ({ range, userId, userName }) => {
                // Notify other users
                socket.broadcast.to(documentId).emit("cursor_changed", {
                    range,
                    userId,
                    userName,
                    colorDetails: uniqolor(userName),
                })
            })

            socket.on("send_message", (documentId, message) => {
                // Notify all users
                io.to(documentId).emit("receive_message", message)
            })

            socket.on("send_comment", async ({ text, index, length }) => {
                try {
                    await createComment({
                        position: `${index}:${length}`,
                        content: text,
                        userId: socket.user._id,
                        documentId,
                    })

                    // Notify other users
                    socket.broadcast.to(documentId).emit("receive_comment", {
                        text,
                        index,
                        length,
                    })
                } catch (err) {
                    console.error(err)
                }
            })

            // For debouncing save operations
            let saveTimeout = null

            // Handle saving document changes with a debounce
            socket.on("send_changes", async ({ title, content }) => {
                socket.broadcast.to(documentId).emit("receive_changes", content)

                clearTimeout(saveTimeout)

                saveTimeout = setTimeout(async () => {
                    // Notify all users that the document has been saved
                    io.to(documentId).emit("save_pending")

                    await updateDocument(documentId, { title, content })

                    // Notify all users that the document has been saved
                    io.to(documentId).emit("save_success", content)
                }, process.env.SAVE_DELAY || 750)
            })
        })

        socket.on("leave_room", (documentId, user) => {
            if (!rooms[documentId]) return

            // Remove the user from the room's user list
            rooms[documentId] = rooms[documentId].filter(
                (u) => u._id !== user._id
            )

            // Notify others
            io.to(documentId).emit("users_changed", rooms[documentId])

            // Leave the room
            socket.leave(documentId)
        })

        socket.on("disconnect", () => {
            const { documentId, user } = socketToRoomMap[socket.id] || {}

            if (documentId && user) {
                // Remove the user from the room's user list
                rooms[documentId] = rooms[documentId].filter(
                    (u) => u._id !== user._id
                )

                // Notify others
                io.to(documentId).emit("users_changed", rooms[documentId])

                // Remove the mapping for the disconnected socket
                delete socketToRoomMap[socket.id]
            }

            printLog(`A user disconnected (${socket.id})`)
        })
    })
}
