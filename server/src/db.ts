import mongoose from 'mongoose'

await import('dotenv').then((dotenv) => dotenv.config())

const DB = process.env.MONGODB_URL

if (typeof DB !== 'string') {
    throw new Error('MONGODB_URL is not defined or not a string')
}

mongoose.connect(DB)
const conn = mongoose.connection

conn.once('open', () => {
    // eslint-disable-next-line no-console
    console.log('connected to database')
})
