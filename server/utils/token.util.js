import jwt from "jsonwebtoken"

const JWT_SECRET = "mysecretkey" // it is just example secret key, in production you should use complex key and save it in .env file

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d"
  })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}
