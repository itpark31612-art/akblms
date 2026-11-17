export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}
export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | unknown;
  timestamp: string;
  path?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    timestamp?: string;
    [key: string]: unknown;
  };
  error?: ApiErrorPayload;
}
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
//# sourceMappingURL=api.d.ts.map
