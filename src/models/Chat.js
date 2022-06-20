const mongoose = require('mongoose')
const Schema = mongoose.Schema,  ObjectId = Schema.ObjectId;

const ChatSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        unique: false
    },
    createdAt: {
        type: Date,
        required: true,
        unique: false
    },
    messages:
        [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: false
        },
        sentAt: {
            type: Date,
            required: true,
            unique: false
        },
        text: {
            type: String,
            required: true,
            unique: false
        },
        readAt: {
            type: Date,
            default: null,
            required: false,
            unique: false
        }
    }],
    require: false,
    unique: false
})


module.exports = mongoose.model('Chat', ChatSchema)