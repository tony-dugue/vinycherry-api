import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiErrorDecorator } from './error.decorator';

export function InternalError(message: string, description?: string, options?: ApiResponseOptions) {
  return ApiErrorDecorator(HttpStatus.INTERNAL_SERVER_ERROR, message, description, options);
}
