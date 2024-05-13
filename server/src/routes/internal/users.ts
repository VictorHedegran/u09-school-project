import axios from 'axios'
import { Router, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import * as CRUD from '../../controllers/userController.js'
import * as levelCRUD from '../../controllers/levelController.js'
import validateSession from '../../middleware/validateSession.js'

await import('dotenv').then((dotenv) => dotenv.config())

interface UserData {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
}

declare module 'express-session' {
    // eslint-disable-next-line no-unused-vars
    interface SessionData {
        userId: string
        accessToken: string
        expiryDate: number
    }
}

const router = Router()

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
)

router.post('/google/auth', async (req: Request, res: Response) => {
    try {
        const { tokens } = await oAuth2Client.getToken(req.body.code) // exchange code for tokens

        if (
            typeof tokens.access_token !== 'string' ||
            tokens.access_token.length === 0 ||
            typeof tokens.refresh_token !== 'string' ||
            tokens.refresh_token.length === 0 ||
            typeof tokens.expiry_date !== 'number'
        ) {
            throw new Error('Invalid tokens')
        }

        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: 'application/json',
                },
            }
        )

        const userData: UserData = response.data

        const userExists = await CRUD.findUserByGoogleId(userData.id)

        if (userExists) {
            const user = await CRUD.updateRefreshToken(userData.id, tokens.refresh_token)
            if (!user) {
                throw new Error(`Can't connect to database`)
            }

            // eslint-disable-next-line no-underscore-dangle
            req.session.userId = user._id.toString()
            req.session.accessToken = tokens.access_token
            req.session.expiryDate = tokens.expiry_date
            return res.send(user)
        }

        const user = await CRUD.createUser(userData, tokens.refresh_token)
        if (!user) {
            throw new Error(`Can't connect to database`)
        }

        // eslint-disable-next-line no-underscore-dangle
        req.session.userId = user._id.toString()
        req.session.accessToken = tokens.access_token
        req.session.expiryDate = tokens.expiry_date
        return res.send(user)
    } catch (error) {
        return res.status(500).send(`Login error`)
    }
})

// eslint-disable-next-line consistent-return
router.post('/google/logout', async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.clearCookie('connect.sid')
        return res.send('No user logged in')
    }
    const refreshToken = await CRUD.findUserRefreshTokenById(req.session.userId)

    // Revoke the refresh token with Google
    axios
        .post('https://oauth2.googleapis.com/revoke', `token=${refreshToken}`)
        .then(() => {
            req.session.destroy((err) => {
                if (err) {
                    return res.sendStatus(500)
                }
                res.clearCookie('connect.sid')
                return res.sendStatus(200)
            })
        })
        .catch(() => {
            return res.status(500).send('Error revoking token')
        })
})

router.get('/userdata', validateSession, async (req, res) => {
    if (!req.session.userId) {
        res.clearCookie('connect.sid')
        return res.status(401).send('No user logged in')
    }
    try {
        const user = await CRUD.findUserById(req.session.userId)
        return res.send(user)
    } catch (error) {
        return res.status(500).send('Error retrieving user data')
    }
})

/**
 * /update route for users is now deprecated, please use a more specific update route
 */
router.put('/update', validateSession, async (req, res) => {
    try {
        const updates = req.body
        const { userId } = req.session // Assuming you have user ID stored in req.userId

        if (!userId) {
            return res.status(400).send('User ID is required')
        }

        const user = await CRUD.findUserByIdAndUpdate(userId, updates)

        if (!user) {
            return res.status(404).send('User not found')
        }

        return res.send(user)
    } catch (error) {
        return res.status(500).send('Error updating user')
    }
})

router.put('/update/exp', validateSession, async (req, res) => {
    try {
        const { newExp } = req.body
        const { userId } = req.session

        if (!userId) {
            return res.status(400).send('User ID is required')
        }

        const user = await CRUD.findUserByIdAndUpdateExp(userId, newExp)

        if (!user) {
            return res.status(404).send('User not found')
        }

        if (
            !user.levels ||
            !user.levels.dty ||
            !user.levels.exr ||
            !user.levels.hlt ||
            !user.levels.mnd
        ) {
            throw new Error('Could not fetch user data')
        }

        let userData = {
            dty: user.levels.dty,
            exr: user.levels.exr,
            hlt: user.levels.hlt,
            mnd: user.levels.mnd,
        }

        if (user.levels.dty.exp > user.levels.dty.expRequired) {
            const newLevelNumber = user.levels.dty.levelNumber + 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'dty')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'dty', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.dty.exp - user.levels.dty.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.exr.exp > user.levels.exr.expRequired) {
            const newLevelNumber = user.levels.exr.levelNumber + 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'exr')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'exr', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.exr.exp - user.levels.exr.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.hlt.exp > user.levels.hlt.expRequired) {
            const newLevelNumber = user.levels.hlt.levelNumber + 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'hlt')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'hlt', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.hlt.exp - user.levels.hlt.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.mnd.exp > user.levels.mnd.expRequired) {
            const newLevelNumber = user.levels.mnd.levelNumber + 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'mnd')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'mnd', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.mnd.exp - user.levels.mnd.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.dty.exp < 0) {
            const newLevelNumber = user.levels.dty.levelNumber - 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'dty')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'dty', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.dty.exp + newLevel.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.exr.exp < 0) {
            const newLevelNumber = user.levels.exr.levelNumber - 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'exr')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'exr', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.dty.exp + newLevel.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.hlt.exp < 0) {
            const newLevelNumber = user.levels.hlt.levelNumber - 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'hlt')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'hlt', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.hlt.exp + newLevel.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        if (user.levels.mnd.exp < 0) {
            const newLevelNumber = user.levels.mnd.levelNumber - 1
            const newLevel = await levelCRUD.findLevelByLevelNumber(newLevelNumber, 'mnd')
            if (newLevel) {
                const newData = await CRUD.findUserByIdAndUpdateLevels(userId, 'mnd', {
                    title: newLevel.title,
                    levelNumber: newLevel.levelNumber,
                    expRequired: newLevel.expRequired,
                    exp: user.levels.mnd.exp + newLevel.expRequired,
                    message: newLevel.message,
                })

                if (newData) {
                    userData = {
                        dty: newData.dty ? newData.dty : user.levels.dty,
                        exr: newData.exr ? newData.exr : user.levels.exr,
                        hlt: newData.hlt ? newData.hlt : user.levels.hlt,
                        mnd: newData.mnd ? newData.mnd : user.levels.mnd,
                    }
                }
            }
        }

        return res.send(userData)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Error updating user')
    }
})

export default router
