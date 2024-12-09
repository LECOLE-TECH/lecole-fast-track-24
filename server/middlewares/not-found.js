import { ErrorResponse } from "../utils/http-response.js"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const notFoundHandler = (req, res, next) => {
  const error = new ErrorResponse(
    ReasonPhrases.NOT_FOUND,
    StatusCodes.NOT_FOUND
  )
  next(error)
}
