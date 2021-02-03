import { InternalServerErrorException } from "@nestjs/common";

export class FileNotFoundException extends InternalServerErrorException {
  constructor(filepath: string) {
    super(`File not found at: ${filepath}`);
  }
}
