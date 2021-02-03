import { ApiProperty } from "@nestjs/swagger";

import { SuccessResponseDto } from "~/application/httpcommon/models";

export class JwtResponse {
  @ApiProperty({ description: "The JWT token containing user information" })
  token: string;
}

export class JwtResponseDto extends SuccessResponseDto<JwtResponse> {
  @ApiProperty({ type: JwtResponse })
  data: JwtResponse;
}
