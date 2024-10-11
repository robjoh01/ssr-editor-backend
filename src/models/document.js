const mongoose = require("mongoose")

const collaboratorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    grant: [
        {
            type: String,
            enum: ["read", "write"], // Assuming grants are limited to 'read' and 'write'
        },
    ],
})

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    collaborators: [collaboratorSchema],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment", // Reference to the Comment model
        },
    ],
    stats: {
        totalEdits: {
            type: Number,
            default: 0,
        },
        totalViews: {
            type: Number,
            default: 0,
        },
        activeComments: {
            type: Number,
            default: 0,
        },
        activeUsers: {
            type: Number,
            default: 0,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
})

const Document = mongoose.model("Document", documentSchema)

module.exports = Document
