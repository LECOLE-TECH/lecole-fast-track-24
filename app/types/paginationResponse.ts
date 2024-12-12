export interface PaginationResponse<T> {
  code: number;
  message: string;
  data: T[];
  currentPage: number;
  totalPage: number;
  recordPerPage: number;
  totalRecord: number;
}
