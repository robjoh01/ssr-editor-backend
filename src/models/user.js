import mongoose from "mongoose"
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document", // Reference to the Document model
        },
    ],
    stats: {
        totalDocuments: {
            type: Number,
            default: 0,
        },
        totalEdits: {
            type: Number,
            default: 0,
        },
        totalComments: {
            type: Number,
            default: 0,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
})

const User = mongoose.model("User", userSchema)

module.exports = User
