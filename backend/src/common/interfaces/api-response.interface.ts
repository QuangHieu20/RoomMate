export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: any[];
  statusCode: number;
  timestamp: string;
  path: string;
}
