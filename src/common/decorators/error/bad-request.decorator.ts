import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiErrorDecorator } from './error.decorator';

export function BadRequest(message: string, description?: string, options?: ApiResponseOptions) {
  return ApiErrorDecorator(HttpStatus.BAD_REQUEST, message, description, options);
}
