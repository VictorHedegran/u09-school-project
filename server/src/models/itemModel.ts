import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
    },
    color: {
        type: String,
    },
    cost: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})

export default mongoose.model('Item', itemSchema)
