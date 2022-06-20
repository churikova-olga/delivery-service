const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
        unique: false
    },
    contactPhone: {
        type: String,
        required: false,
        unique: false
    },
    __v: {
        type: Number,
        select: false
    }
});


module.exports = mongoose.model("User", userScheme)

