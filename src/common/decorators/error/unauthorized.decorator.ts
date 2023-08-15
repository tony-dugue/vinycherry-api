import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiErrorDecorator } from './error.decorator';

export function Unauthorized(message: string, description?: string, options?: ApiResponseOptions) {
  return ApiErrorDecorator(HttpStatus.UNAUTHORIZED, message, description, options);
}

