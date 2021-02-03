import { InternalServerErrorException } from "@nestjs/common";

export class RepositoryFailureException extends InternalServerErrorException {
  constructor(message = "Unexpected error thrown when managing data") {
    super(message);
  }
}
