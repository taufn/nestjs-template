import { BadRequestException, Injectable } from "@nestjs/common";

import { ValidateUserPassword } from "../contracts";
import * as spec from "../specifications";
import { specification } from "~/utils/functions";

@Injectable()
export class PasswordValidationService implements ValidateUserPassword {
  public validatePassword(value: string): void {
    const rule = specification(spec.passwordMinLength);
    const skip = rule.and(spec.passwordIsLongEnough);
    const char = rule
      .and(spec.passwordMinLetter)
      .and(spec.passwordMinNumeric)
      .and(spec.passwordMinSpecialChar);
    const passed = skip.isSatisfiedBy(value) || char.isSatisfiedBy(value);
    if (!passed) {
      throw new BadRequestException("Password does not match the rule");
    }
  }
}
