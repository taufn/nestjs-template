import { Injectable } from "@nestjs/common";
import snakecaseKeys = require("snakecase-keys");

import { statusCodes } from "../constants";
import { ResponseBuilder } from "../contracts";
import {
  ErrorPayloadDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from "../models";

@Injectable()
export class ResponseBuilderService implements ResponseBuilder {
  public success<T, M = any>(
    data: T,
    status?: string,
    code?: string,
    meta?: M,
  ): SuccessResponseDto<T, M> {
    return snakecaseKeys({
      data,
      status: status || "success",
      statusCode: code || statusCodes.success,
      meta: meta || ({} as M),
    });
  }

  public error<M = any>(
    errors: ErrorPayloadDto[],
    status?: string,
    code?: string,
    meta?: M,
  ): ErrorResponseDto<M> {
    return snakecaseKeys({
      errors,
      status: status || "error",
      statusCode: code || statusCodes.genericError,
      meta: meta || ({} as M),
    });
  }
}
