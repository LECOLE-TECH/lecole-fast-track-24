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
  search: string = ""
): QueryObserverResult<ResponseList<Product>, any> => {
  return useQuery<ResponseList<Product>, any>({
    queryFn: async () => {
      const { data } = await getProductsAPI(page, search)
      return data
    },
    queryKey: ["products", { page, search }],
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData
  })
}
