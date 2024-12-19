import { AxiosResponse } from "axios"
import AxiosInstance from "~/axios"
import { Todo } from "~/types/interface"

export const syncDataTodoAPI = async (
  todos: Todo[]
): Promise<
  AxiosResponse<
    {
      status: number
      data: {
        todos: Todo[]
      }
      message: string
    },
    any
  >
> => {
  return await AxiosInstance.post("/todos/sync", {
    data: todos
  })
}

export const deleteTodoAPI = async (
  id: number
): Promise<
  AxiosResponse<
    {
      status: number
      data: {
        id: number
      }
      message: string
    },
    any
  >
> => {
  return await AxiosInstance.delete(`/todos/${id}`)
}
