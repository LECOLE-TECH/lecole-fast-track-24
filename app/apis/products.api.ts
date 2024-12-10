import type { AxiosResponse } from "axios"
import AxiosInstance from "~/axios"
import type { ResponseList } from "~/types/interface"
import type { Product } from "~/types/products.types"
import { InsertProduct } from "~/utils/schema"

export const getProductsAPI = async (
  page = 1,
  search: string = ""
): Promise<AxiosResponse<ResponseList<Product>, any>> => {
  return await AxiosInstance.get(`/products?&page=${page}&search=${search}`)
}

export const deleteProductsAPI = async (
  ids: number[]
): Promise<AxiosResponse<{ data: { deleteIds: number[] } }, any>> => {
  return await AxiosInstance.delete(`/products`, {
    data: {
      ids
    }
  })
}

export const insertProductsAPI = async (
  data: InsertProduct
): Promise<AxiosResponse<{ data: { id: number } }, any>> => {
  return await AxiosInstance.post(`/products`, data)
}

export const editProductsAPI = async (
  data: Product
): Promise<AxiosResponse<{ data: { id: number } }, any>> => {
  return await AxiosInstance.put(`/products/${data.id}`, data)
}
