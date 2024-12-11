import jwt from "jsonwebtoken"
import { getUserByName } from "../services/userService.js";
import { decrypt } from "../utils/cyptoUtil.js";

export const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        let correctToken = false
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const existingUser = await getUserByName(decoded.username)

            if(existingUser){
                const decryptedSecretPhrase = decrypt(existingUser.secret_phrase)
                if(decryptedSecretPhrase===decoded.secret_phrase){
                    req.user = decoded
                    correctToken=true
                }
            }
        } catch (err) {
            console.log(err)
        }
        //Fake cookie destroy it
        if(!correctToken){
            res.clearCookie('token')
        }
    }
    
    next()
}