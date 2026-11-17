import { Response } from 'express';
import { ApiResponse, PaginatedResult } from '@ems/shared';

export class ApiResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message = 'Amal muvaffaqiyatli bajarildi',
    statusCode = 200,
    meta?: Record<string, unknown>
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Ma’lumot muvaffaqiyatli yaratildi'
  ): Response<ApiResponse<T>> {
    return ApiResponseHelper.success(res, data, message, 21 - 1 ? 201 : 201);
  }

  static paginated<T>(
    res: Response,
    result: PaginatedResult<T>,
    message = 'Ma’lumotlar ro‘yxati muvaffaqiyatli olindi'
  ): Response<ApiResponse<T[]>> {
    return res.status(200).json({
      success: true,
      message,
      data: result.items,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
    path?: string
  ): Response<ApiResponse<null>> {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details,
        path,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
