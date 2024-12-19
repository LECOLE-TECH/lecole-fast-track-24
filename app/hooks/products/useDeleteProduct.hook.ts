import {
  useMutation,
  useQueryClient,
  type UseMutationResult
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { deleteProductsAPI } from "~/apis/products.api"

export const useDeleteProduct = (): UseMutationResult<
  AxiosResponse<{ data: { deleteIds: number[] } }, any>,
  unknown,
  number[]
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) => deleteProductsAPI(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
