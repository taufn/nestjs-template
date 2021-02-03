import { BadRequestException } from "@nestjs/common";

export class DuplicateRowException extends BadRequestException {
  constructor(message = "Entity with given values already exists") {
    super(message);
  }
}
