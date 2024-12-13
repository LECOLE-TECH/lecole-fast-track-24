import {
  useMutation,
  useQueryClient,
  type UseMutationResult
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { registerUserAPI } from "~/apis/user.api"
import { User } from "~/types/users.types"
import { RegisterUser } from "~/utils/schema"

export const useRegisterUser = (): UseMutationResult<
  AxiosResponse<{ data: { user: User } }, any>,
  unknown,
  RegisterUser
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterUser) => registerUserAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  })
}
