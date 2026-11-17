export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, code = 'ERROR', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Noto‘g‘ri so‘rov yuborildi', details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Avtorizatsiyadan o‘tilmagan yoki token yaroqsiz', details?: unknown) {
    super(401, message, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Ushbu amalni bajarish uchun sizda ruxsat yo‘q', details?: unknown) {
    super(403, message, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'So‘ralgan ma’lumot topilmadi', details?: unknown) {
    super(404, message, 'NOT_FOUND', details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Ma’lumotlar to‘qnashuvi yuz berdi', details?: unknown) {
    super(409, message, 'CONFLICT', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Ma’lumotlarni tekshirishda xatolik yuz berdi', details?: unknown) {
    super(422, message, 'VALIDATION_ERROR', details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Ichki server xatoligi yuz berdi', details?: unknown) {
    super(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}
