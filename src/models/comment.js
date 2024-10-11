const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document", // Reference to the Document model
        required: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
