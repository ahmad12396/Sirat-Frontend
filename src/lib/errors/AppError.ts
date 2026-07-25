import {
  ERROR_CODE_STATUS,
  ERROR_CODES,
  type ErrorCode,
} from "@/lib/errors/ErrorCodes";
import type { ApiFieldError } from "@/types/api";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly fieldErrors?: ApiFieldError[];
  readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
    options?: {
      statusCode?: number;
      fieldErrors?: ApiFieldError[];
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode ?? ERROR_CODE_STATUS[code];
    this.fieldErrors = options?.fieldErrors;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  static unauthorized(message = "You must be signed in to do this.") {
    return new AppError(message, ERROR_CODES.UNAUTHORIZED);
  }

  static forbidden(message = "You don't have permission to do this.") {
    return new AppError(message, ERROR_CODES.FORBIDDEN);
  }

  static notFound(message = "The requested resource was not found.") {
    return new AppError(message, ERROR_CODES.NOT_FOUND);
  }

  static validation(message: string, fieldErrors?: ApiFieldError[]) {
    return new AppError(message, ERROR_CODES.VALIDATION_ERROR, { fieldErrors });
  }
}
