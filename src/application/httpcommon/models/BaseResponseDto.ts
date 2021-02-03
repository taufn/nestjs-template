// import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseResponseDto<M = any> {
  // @ApiProperty()
  status: string;

  // @ApiProperty({
  //   name: "status_code",
  //   description: "Char code identifying response type",
  // })
  statusCode: string;

  // @ApiProperty()
  meta: M;
}
