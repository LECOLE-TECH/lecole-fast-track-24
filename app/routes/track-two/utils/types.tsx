import {z} from "zod"
export interface User{
    id:string
    username:string
    roles:string
    secretPhrase:string
}

export const newUserSchema = z.object({
    username:z.string().min(3,"Username must have at least 3 characters"),
    secretPhrase:z.string().min(8,"Secret phrase muset have at least 8 characters"),
    roles: z.string().regex(/user|admin/,"Roles must be User or Admin")
})

export const loginUserSchema = z.object({
    username:z.string().min(3,"Username must have at least 3 characters"),
    secretPhrase:z.string().min(8,"Secret phrase muset have at least 8 characters"),
})

export const updateSecretSchema = z.object({
    secretPhrase:z.string().min(8,"Secret phrase muset have at least 8 characters"),
})

export type newUser = Omit<User,"id">