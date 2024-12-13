import { verifyToken } from "../utils/token.util.js"

export const authorization = (req, res, next) => {
  const token = req.headers.authorization

  if (token === "null") {
    req.role = ""
    return next()
  } else {
    const decoededToken = verifyToken(token)
    req.role = decoededToken.role
    return next()
  }
}
