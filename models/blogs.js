const mongoose = require("mongoose")
const { Schema } = mongoose

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General",
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('blogs', NoteSchema)