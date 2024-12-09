import type { AxiosResponse } from "axios"
import AxiosInstance from "~/axios"
import type { ResponseList } from "~/types/interface"
import type { Product } from "~/types/products.types"

export const getProductsAPI = async (
  page = 1,
  search: string = ""
): Promise<AxiosResponse<ResponseList<Product>, any>> => {
  return await AxiosInstance.get(`/products?&page=${page}&search=${search}`)
}

export const deleteProductsAPI = async (ids: number[]) => {
  return await AxiosInstance.delete(`/products`, { data: ids })
}

export const addProductsAPI = async (data: Omit<Product, "id" | "image">) => {
  return await AxiosInstance.post(`/products`, data)
}

export const updateProductsAPI = async (
  data: Partial<Omit<Product, "id" | "image">>
) => {
  return await AxiosInstance.put(`/products`, data)
}
