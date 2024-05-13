import { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import * as CRUD from '../controllers/userController.js'

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
)

async function getNewAccessToken(refreshToken: string) {
    try {
        oAuth2Client.setCredentials({ refresh_token: refreshToken })
        const tokenData = await oAuth2Client.refreshAccessToken()
        // eslint-disable-next-line camelcase
        const { access_token, expiry_date } = tokenData.credentials
        // eslint-disable-next-line camelcase
        return { accessToken: access_token, expiryDate: expiry_date }
    } catch (error) {
        console.error('Error refreshing access token:', error)
        throw error
    }
}

async function validateAccessToken(accessToken: string) {
    try {
        await oAuth2Client.getTokenInfo(accessToken)
        return true
    } catch (error) {
        console.error('Error validating access token:', error)
        return false
    }
}

// eslint-disable-next-line consistent-return
export default async function validateSession(req: Request, res: Response, next: NextFunction) {
    if (!req.session.expiryDate || !req.session.accessToken || !req.session.userId) {
        res.clearCookie('connect.sid')
        return res.status(401).send('No user logged in')
    }

    let { accessToken } = req.session

    if (new Date() >= new Date(req.session.expiryDate)) {
        try {
            const refreshToken = await CRUD.findUserRefreshTokenById(req.session.userId)

            if (!refreshToken) {
                res.clearCookie('connect.sid')
                return res.status(401).send('No user logged in')
            }

            const newTokenData = await getNewAccessToken(refreshToken)

            if (
                !newTokenData ||
                typeof newTokenData.accessToken !== 'string' ||
                typeof newTokenData.expiryDate !== 'number'
            ) {
                res.clearCookie('connect.sid')
                return res.status(401).send('Error obtaining new token')
            }

            req.session.accessToken = newTokenData.accessToken
            req.session.expiryDate = newTokenData.expiryDate

            accessToken = newTokenData.accessToken
        } catch (error) {
            console.error('Error refreshing access token:', error)
            res.clearCookie('connect.sid')
            return res.status(500).send('Server error')
        }
    }

    try {
        const isValid = await validateAccessToken(accessToken)

        if (!isValid) {
            res.clearCookie('connect.sid')
            return res.status(401).send('Invalid access token')
        }
    } catch (error) {
        console.error('Error validating access token:', error)
        return res.status(500).send('Server error')
    }

    next()
}
