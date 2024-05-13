import mongoose from 'mongoose'

const levelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    levelNumber: {
        type: Number,
        required: true,
    },
    stat: {
        type: String,
        required: true,
    },
    expRequired: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})

export default mongoose.model('Level', levelSchema)
