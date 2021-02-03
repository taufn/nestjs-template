/**
 * The exceptions are currently grouped together as we don't know yet how we
 * want to structure their hierarchy. I.e., which exception should inherit from
 * which. This file should be refactored once there is a pattern emerging.
 */

export class FileNotFoundException extends Error {
  constructor(filepath: string) {
    super(`File not found at: ${filepath}`);
  }
}

export class UnexpectedException extends Error {
  constructor(message = "The system experienced unexpected situation") {
    super(message);
  }
}
