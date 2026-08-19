export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageInfo;
}