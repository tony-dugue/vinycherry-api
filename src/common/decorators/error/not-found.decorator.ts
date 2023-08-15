import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiErrorDecorator } from './error.decorator';

export function NotFound(message: string, description?: string, options?: ApiResponseOptions) {
  return ApiErrorDecorator(HttpStatus.NOT_FOUND, message, description, options);
}
