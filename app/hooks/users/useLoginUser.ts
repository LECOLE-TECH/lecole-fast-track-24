import {
  useMutation,
  useQueryClient,
  type UseMutationResult
} from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { toast } from "react-toastify"
import { loginUserAPI } from "~/apis/user.api"
import { useStore } from "~/store"
import { User } from "~/types/users.types"
import { LoginUser } from "~/utils/schema"

export const useLoginUser = (): UseMutationResult<
  AxiosResponse<{ data: { user: User } }, any>,
  unknown,
  LoginUser
> => {
  const { setToken, setUser } = useStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await loginUserAPI(data)
      return response.data
    },

    onSuccess: (data) => {
      setUser(data.data)
      setToken(data.data.token)
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },

    onError: () => {
      toast.error("Login failed")
    }
  })
}
