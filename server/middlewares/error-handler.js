export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"
  const responseData = {
    status: statusCode,
    message,
    path: req.originalUrl,
    stack: err.stack
  }
  res.status(statusCode).json(responseData)
}