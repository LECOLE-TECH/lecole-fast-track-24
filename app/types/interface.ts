export interface ResponseList<T> {
  data: {
    limit: number
    page: number
    total: number
    totalPages: number
    items: T[]
  }
}

export enum ActionSheet {
  INSERT = 1,
  EDIT = 2,
  DEFAULT = 0
}

export enum ActionDialog {
  REGISTER = 1,
  DEFAULT = 0,
  LOGIN = 2,
  CHANGE_SECRET = 3
}

export enum TodoStatus {
  BACKLOG = "backlog",
  IN_PROGRESS = "progress",
  DONE = "done"
}

export interface Todo {
  id: number
  title: string
  status: TodoStatus
  synced: boolean
  created_at: string
}
