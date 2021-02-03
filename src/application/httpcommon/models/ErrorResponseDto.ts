// import { ApiProperty } from "@nestjs/swagger";

import { BaseResponseDto } from "./BaseResponseDto";
import { ErrorPayloadDto } from "./ErrorPayloadDto";

export class ErrorResponseDto<M = any> extends BaseResponseDto<M> {
  // @ApiProperty({ type: [ErrorPayloadDto] })
  errors: ErrorPayloadDto[];
}
