// import { ApiProperty } from "@nestjs/swagger";

import { BaseResponseDto } from "./BaseResponseDto";

export class SuccessResponseDto<T = any, M = any> extends BaseResponseDto<M> {
  // @ApiProperty()
  data: T;
}
