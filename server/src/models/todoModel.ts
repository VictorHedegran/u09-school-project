import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    stats: {
        dty: {
            type: Number,
        },
        exr: {
            type: Number,
        },
        hlt: {
            type: Number,
        },
        mnd: {
            type: Number,
        },
    },
    coins: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['unfinished', 'finished', 'overdue'],
            message: 'Invalid status',
        },
        required: true,
    },
    schedule: {
        dueDate: {
            type: Date,
            required: true,
        },
        repeatable: {
            type: Boolean,
            default: false,
        },
        repeatInterval: {
            type: String,
        },
    },
})

export default mongoose.model('Todo', todoSchema)
