export interface ResponseList<T> {
  data: {
    limit: number
    page: number
    total: number
    totalPages: number
    items: T[]
  }
}
