export class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.message = message
    this.status = status
  }
}

export class SuccessResponse {
  constructor(message, statusCode, data) {
    this.message = message
    this.statusCode = statusCode
    this.data = { ...data }
  }

  send(res) {
    res.status(this.statusCode).json(this)
  }
}
