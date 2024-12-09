import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { WHITELISTED_ORIGINS } from "../utils/constant.util.js"
import { ErrorResponse } from "../utils/http-response.js"

export const corsOptions = {
  origin(requestOrigin, callback) {
    // Allow requests from postman. Normally postman will have orgin as undefined
    if (!requestOrigin) {
      return callback(null, true)
    }

    if (WHITELISTED_ORIGINS.includes(requestOrigin)) {
      return callback(null, true)
    }

    return callback(
      new ErrorResponse(ReasonPhrases.FORBIDDEN, StatusCodes.FORBIDDEN)
    )
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200
}
