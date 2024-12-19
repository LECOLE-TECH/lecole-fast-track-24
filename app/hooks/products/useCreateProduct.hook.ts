import {
  useMutation,
  useQueryClient,
  type UseMutationResult
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { insertProductsAPI } from "~/apis/products.api"
import { InsertProduct } from "~/utils/schema"

export const useInsertProduct = (): UseMutationResult<
  AxiosResponse<{ data: { id: number } }, any>,
  unknown,
  InsertProduct
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InsertProduct) => insertProductsAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
