import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        displayName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    encryptedData: {
        encryptedToken: {
            type: String,
        },
        iv: {
            type: String,
        },
        authTag: {
            type: String,
        },
    },
    levels: {
        dty: {
            title: {
                type: String,
                default: 'Careless',
            },
            levelNumber: {
                type: Number,
                default: 1,
            },
            expRequired: {
                type: Number,
                default: 100,
            },
            exp: {
                type: Number,
                default: 0,
            },
            message: {
                type: String,
                default: 'You have no sense of duty, do you?',
            },
        },
        exr: {
            title: {
                type: String,
                default: 'Weak',
            },
            levelNumber: {
                type: Number,
                default: 1,
            },
            expRequired: {
                type: Number,
                default: 100,
            },
            exp: {
                type: Number,
                default: 0,
            },
            message: {
                type: String,
                default: 'You have no muscles, do you?',
            },
        },
        hlt: {
            title: {
                type: String,
                default: 'Unhealthy',
            },
            levelNumber: {
                type: Number,
                default: 1,
            },
            expRequired: {
                type: Number,
                default: 100,
            },
            exp: {
                type: Number,
                default: 0,
            },
            message: {
                type: String,
                default: 'You do not really care about your health, do you?',
            },
        },
        mnd: {
            title: {
                type: String,
                default: 'Stupid',
            },
            levelNumber: {
                type: Number,
                default: 1,
            },
            expRequired: {
                type: Number,
                default: 100,
            },
            exp: {
                type: Number,
                default: 0,
            },
            message: {
                type: String,
                default: 'You are not really that smart, are you?',
            },
        },
    },
    customization: {
        theme: {
            type: String,
            default: '',
        },
        border: {
            type: String,
            default: '',
        },
    },
    inventory: {
        coins: {
            type: Number,
            default: 0,
        },
        items: {
            type: [String],
            default: [],
        },
    },
})

export default mongoose.model('User', userSchema)
