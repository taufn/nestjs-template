import {
  ErrorPayloadDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from "../models";

export interface ResponseBuilder {
  success<T, M = any>(
    data: T,
    status?: string,
    statusCode?: string,
    meta?: M,
  ): SuccessResponseDto<T, M>;
  error<M = any>(
    errors: ErrorPayloadDto[],
    status?: string,
    statusCode?: string,
    meta?: M,
  ): ErrorResponseDto<M>;
}
