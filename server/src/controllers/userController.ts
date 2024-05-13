import { decryptToken, encryptToken } from '../services/encryption.js'
import User from '../models/userModel.js'

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
/**
 * findUserByGoogleId - This function is used to check the existence of a user based on their Google ID.
 * It should only be used during the login process to verify if a user is already present in the database.
 * For other operations, prefer using the findUserById function which utilizes the internal MongoDB _id,
 * ensuring better security and data integrity.
 */
export async function findUserByGoogleId(userId: string) {
    const user = await User.findOne({ userId })
    return !!user
}

export async function findUserById(idQuery: string) {
    const user = await User.findById(idQuery).select('-encryptedData -userId -_id')
    return user
}

export async function createUser(userData: UserData, refreshToken: string) {
    const encryptedData = encryptToken(refreshToken)
    const { _id } = await User.create({
        userId: userData.id,
        profile: {
            displayName: userData.name,
            email: userData.email,
            imageUrl: userData.picture,
        },
        encryptedData,
    })

    const user = await User.findOne({ _id }).select('-encryptedData -userId')
    return user
}

export async function updateRefreshToken(userId: string, refreshToken: string) {
    const encryptedData = encryptToken(refreshToken)
    const user = await User.findOneAndUpdate({ userId }, { encryptedData }).select(
        '-encryptedData -userId'
    )
    return user
}

export async function findUserRefreshTokenById(idQuery: string) {
    const encryptedData = await User.findById(idQuery).select('encryptedData')
    if (!encryptedData || !encryptedData.encryptedData) {
        return null
    }
    const decryptedRefreshToken = decryptToken(encryptedData.encryptedData)
    return decryptedRefreshToken
}

/**
 * findUserByIdAndUpdate function is now deprecated, please use a more specific update function
 */
export async function findUserByIdAndUpdate(userId: string, updates: any) {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { exp: updates.updates.exp },
            { new: true, runValidators: true }
        ).select('-encryptedData -userId -_id')
        return user
    } catch (error) {
        return null
    }
}

export async function findUserByIdAndUpdateExp(
    userId: string,
    exp: { dty: number; exr: number; hlt: number; mnd: number }
) {
    try {
        const updateDty = 'levels.dty.exp'
        const updateExr = 'levels.exr.exp'
        const updateHlt = 'levels.hlt.exp'
        const updateMnd = 'levels.mnd.exp'
        const updateObject = {
            [updateDty]: exp.dty,
            [updateExr]: exp.exr,
            [updateHlt]: exp.hlt,
            [updateMnd]: exp.mnd,
        }

        const user = await User.findByIdAndUpdate(userId, updateObject, {
            new: true,
            runValidators: true,
        }).select('-encryptedData -userId -_id')
        return user
    } catch (error) {
        return null
    }
}

export async function findUserByIdAndUpdateLevels(
    userId: string,
    stat: string,
    newLevel: {
        title: String
        levelNumber: Number
        expRequired: Number
        exp: Number
        message: String
    }
) {
    try {
        const updatePath = `levels.${stat}`
        const updateObject = { [updatePath]: newLevel }

        const userData = await User.findByIdAndUpdate(userId, updateObject, {
            new: true,
            runValidators: true,
        })

        if (userData?.levels) {
            return userData.levels
        }

        return null
    } catch (error) {
        return null
    }
}
