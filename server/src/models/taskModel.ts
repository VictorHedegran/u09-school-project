import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'task',
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stats: {
        dty: {
            type: Number,
            required: true,
        },
        exr: {
            type: Number,
            required: true,
        },
        hlt: {
            type: Number,
            required: true,
        },
        mnd: {
            type: Number,
            required: true,
        },
    },
    coins: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
})

export default mongoose.model('Task', taskSchema)
