import { type ResponseList } from "./../../types/interface"
import {
  keepPreviousData,
  type QueryObserverResult,
  useQuery
} from "@tanstack/react-query"
import { getProductsAPI } from "~/apis/products.api"
import type { Product } from "~/types/products.types"
export const useGetProducts = (
  page = 1,
  limit = 10,
  search: string = ""
): QueryObserverResult<ResponseList<Product>, any> => {
  return useQuery<ResponseList<Product>, any>({
    queryFn: async () => {
      const { data } = await getProductsAPI(page, limit, search)
      return data
    },
    queryKey: ["products", { page, limit, search }],
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData
  })
}
