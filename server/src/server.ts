import express from 'express'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import './db.js'
import * as PUBLIC_API from './routes/public/index.js'
import * as INTERNAL_API from './routes/internal/index.js'

async function initializeServer() {
    await import('dotenv').then((dotenv) => dotenv.config())

    const app = express()

    const allowedOrigins: string[] = [
        'https://levelupirl.netlify.app',
        'https://pwa-test--whimsical-malasada-225c04.netlify.app'
    ];
    
    app.use(
        cors({
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            credentials: true,
        })
    );

    app.use(express.json())

    app.use(express.urlencoded({ extended: true }))

    app.set('trust proxy', 1)

    app.use(
        session({
            secret: process.env.SESSION_SECRET || '',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            },
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URL,
                collectionName: 'sessions',
            }),
        })
    )

    const PORT = process.env.PORT || 4000

    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send('Hello World')
    })

    app.use('/api/v1/public/tasks', PUBLIC_API.default)

    app.use('/api/v1/internal/levels', INTERNAL_API.levels)

    app.use('/api/v1/internal/items', INTERNAL_API.items)

    app.use('/api/v1/internal/users', INTERNAL_API.users)

    app.use('/api/v1/internal/todos', INTERNAL_API.todos)

    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${PORT}`)
    })
}

initializeServer()
