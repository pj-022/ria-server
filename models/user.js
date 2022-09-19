const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    fullname:{
        type: String,
        required: true
    },
    job:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', UserSchema)