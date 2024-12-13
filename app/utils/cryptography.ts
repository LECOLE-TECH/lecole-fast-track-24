import CryptoJS from "crypto-js"

const secretKey = "cryptography-secret-key"

export const encryptMessage = (message: any): string => {
  const messageString =
    typeof message === "string" ? message : JSON.stringify(message)
  return CryptoJS.AES.encrypt(messageString, secretKey).toString()
}

export const decryptMessage = (encryptedMessage: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)

    try {
      return JSON.parse(decryptedString)
    } catch (error) {
      return decryptedString
    }
  } catch (error) {
    console.error("Decryption failed:", error)
    return null
  }
}
