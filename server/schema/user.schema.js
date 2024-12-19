import { z } from "zod"
export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least 3 characters." })
    .max(256, { message: "username must be at most 256 characters." })
    .nonempty({ message: "username is required." }),

  role: z.string().nonempty({ message: "Role is required." }),

  secret: z
    .string()
    .min(3, { message: "Secret must be at least 3 characters." })
    .max(256, { message: "Secret must be at most 256 characters." })
    .nonempty({ message: "Secret is required." })
})

export const loginUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least 3 characters." })
    .max(256, { message: "username must be at most 256 characters." })
    .nonempty({ message: "username is required." }),
  secret: z
    .string()
    .min(3, { message: "Secret must be at least 3 characters." })
    .max(256, { message: "Secret must be at most 256 characters." })
    .nonempty({ message: "Secret is required." })
})
