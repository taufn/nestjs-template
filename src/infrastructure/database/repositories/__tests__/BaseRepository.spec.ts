import { BaseRepository } from "../BaseRepository";

describe("infrastructure/database/repositories/BaseRepository", () => {
  it("should be defined", () => {
    expect(typeof BaseRepository).toBe("function");
  });

  // more comprehensive tests are available on
  // `tests/integration/BaseRepository.integration.spec.ts`
});
