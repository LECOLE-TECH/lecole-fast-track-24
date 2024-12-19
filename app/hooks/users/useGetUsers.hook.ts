import { type ResponseList } from "../../types/interface"
import {
  keepPreviousData,
  type QueryObserverResult,
  useQuery
} from "@tanstack/react-query"
import { getUsersAPI } from "~/apis/user.api"
import { User } from "~/types/users.types"
export const useGetUsers = (
  page = 1,
  limit = 10,
  search: string = ""
): QueryObserverResult<ResponseList<User>, any> => {
  return useQuery<ResponseList<User>, any>({
    queryFn: async () => {
      const { data } = await getUsersAPI(page, limit, search)
      return data
    },
    queryKey: ["users", { page, limit, search }],
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData
  })
}
