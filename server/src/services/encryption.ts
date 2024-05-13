import crypto from 'crypto'

export function encryptToken(token: string) {
    try {
        const algorithm = 'aes-256-gcm'
        const key = process.env.CRYPTO_KEY || ''
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(algorithm, key, iv)

        const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
        const authTag = cipher.getAuthTag()

        return {
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            encryptedToken: encrypted.toString('hex'),
        }
    } catch (error) {
        console.error('Encryption failed:', error)
        return null
    }
}

export function decryptToken(encryptedData: any) {
    try {
        const algorithm = 'aes-256-gcm'
        const key = process.env.CRYPTO_KEY || ''

        const iv = Buffer.from(encryptedData.iv, 'hex')
        const authTag = Buffer.from(encryptedData.authTag, 'hex')
        const encryptedToken = Buffer.from(encryptedData.encryptedToken, 'hex')

        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        decipher.setAuthTag(authTag)

        let token = decipher.update(encryptedToken)
        token = Buffer.concat([token, decipher.final()])

        return token.toString('utf8')
    } catch (error) {
        console.error('Decryption failed:', error)
        return null
    }
}
