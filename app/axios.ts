import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElement } from "~/utils/formatter"
import { APP_CONSTANTS } from "./utils/constant"

const AxiosInstance = axios.create({})
AxiosInstance.defaults.timeout = 1000 * 60 * 10
AxiosInstance.defaults.baseURL = APP_CONSTANTS.ROOT_API
AxiosInstance.defaults.withCredentials = true
AxiosInstance.defaults.headers.post["Content-Type"] = "application/json"

// handle user just click one time on button or submit form ...
AxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElement(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// handle error data from server
AxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElement(false)
    return response
  },
  (error) => {
    interceptorLoadingElement(false)

    let errorMessage =
      JSON.parse(error?.response?.data?.message) || JSON.parse(error.message)
    if (error?.response?.status !== 410) {
      if (typeof errorMessage === "string") {
        toast.error(JSON.parse(errorMessage))
      } else {
        const message = Object.values(errorMessage[0]) as [[string]]
        toast.error(message[0][0] as string)
      }
    }
    return Promise.reject(error)
  }
)

export default AxiosInstance
