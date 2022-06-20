const mongoose = require('mongoose')
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

const AdvertisementSchema = new Schema({
    shortText: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    images: [{
        type: String,
        required: false,
    }],

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
    },

    createdAt: {
        type: Date,
        required: true,
        unique: false
    },

    updatedAt: {
        type: Date,
        required: true,
        unique: false
    },

    tags: [{
        type: String,
        required: false,
    }],

    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
        unique: false
    }
})

module.exports = mongoose.model('Advertisement', AdvertisementSchema)

