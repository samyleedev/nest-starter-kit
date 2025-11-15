export interface PaginatedResults<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
