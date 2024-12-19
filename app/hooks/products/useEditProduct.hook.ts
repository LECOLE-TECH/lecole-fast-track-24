import {
  useMutation,
  useQueryClient,
  type UseMutationResult
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { editProductsAPI } from "~/apis/products.api"
import { Product } from "~/types/products.types"

export const useEditProduct = (): UseMutationResult<
  AxiosResponse<{ data: { id: number } }, any>,
  unknown,
  Product
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Product) => editProductsAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
