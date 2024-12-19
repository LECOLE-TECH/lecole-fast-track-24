import type { AxiosResponse } from "axios"
import AxiosInstance from "~/axios"
import { useStore } from "~/store"
import type { ResponseList } from "~/types/interface"
import type { Product } from "~/types/products.types"
import { User } from "~/types/users.types"
import { InsertProduct, LoginUser, RegisterUser } from "~/utils/schema"

export const getUsersAPI = async (
  page = 1,
  limit = 10,
  search: string = "",
  token: string = useStore.getState().token!
): Promise<AxiosResponse<ResponseList<User>, any>> => {
  return await AxiosInstance.get(
    `/users?&page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `${token}`
      }
    }
  )
}

export const registerUserAPI = async (data: RegisterUser) => {
  return await AxiosInstance.post(`/users/register`, data)
}

export const loginUserAPI = async (data: LoginUser) => {
  return await AxiosInstance.post(`/users/login`, data)
}

export const deleteUsersAPI = async (
  ids: number[]
): Promise<AxiosResponse<{ data: { deleteIds: number[] } }, any>> => {
  return await AxiosInstance.delete(`/users`, {
    data: {
      ids
    }
  })
}

export const insertUsersAPI = async (
  data: InsertProduct
): Promise<AxiosResponse<{ data: { id: number } }, any>> => {
  return await AxiosInstance.post(`/users`, data)
}

export const editUsersAPI = async (
  data: Product
): Promise<AxiosResponse<{ data: { id: number } }, any>> => {
  return await AxiosInstance.put(`/users/${data.id}`, data)
}
