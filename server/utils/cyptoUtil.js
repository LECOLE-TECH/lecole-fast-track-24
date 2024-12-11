import crypto from "crypto"

export const encrypt = (text) => {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY,process.env.SALT,32)
    const iv = crypto.randomBytes(Number(process.env.IV_LENGTH))
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
}

export const decrypt = (text) => {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY,process.env.SALT,32)
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
