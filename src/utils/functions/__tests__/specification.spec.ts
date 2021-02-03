import { PredicateFn, specification } from "../specification";

describe("utils/functions/specification", () => {
  const greaterThan: (num: number) => PredicateFn = (comp: number) => (
    val: number,
  ) => val > comp;
  const gt1 = greaterThan(1);
  const gt5 = greaterThan(5);
  const gt9 = greaterThan(9);

  it("should be defined", () => {
    expect(typeof specification).toBe("function");
  });

  it("should be a predicate on its own", () => {
    expect(specification(gt1).isSatisfiedBy(1)).toBe(false);
    expect(specification(gt5).isSatisfiedBy(10)).toBe(true);
    expect(specification(gt9).isSatisfiedBy(8)).toBe(false);
  });

  it("should support AND specification", () => {
    const gt1n5 = specification(gt1).and(gt5);
    const gt5n9 = specification(gt5).and(gt9);

    expect(gt1n5.isSatisfiedBy(3)).toBe(false);
    expect(gt1n5.isSatisfiedBy(31)).toBe(true);
    expect(gt5n9.isSatisfiedBy(8)).toBe(false);
    expect(gt5n9.isSatisfiedBy(18)).toBe(true);
  });

  it("should support OR specification", () => {
    const gt1o5 = specification(gt1).or(gt5);
    const gt5o9 = specification(gt5).or(gt9);

    expect(gt1o5.isSatisfiedBy(3)).toBe(true);
    expect(gt1o5.isSatisfiedBy(1)).toBe(false);
    expect(gt5o9.isSatisfiedBy(8)).toBe(true);
    expect(gt5o9.isSatisfiedBy(1)).toBe(false);
  });

  it("should support NOT specification", () => {
    const gt1lt5 = specification(gt1).not(gt5);
    const gt1lt9 = specification(gt1).not(gt9);

    expect(gt1lt5.isSatisfiedBy(3)).toBe(true);
    expect(gt1lt5.isSatisfiedBy(5)).toBe(true);
    expect(gt1lt5.isSatisfiedBy(6)).toBe(false);
    expect(gt1lt9.isSatisfiedBy(8)).toBe(true);
    expect(gt1lt9.isSatisfiedBy(10)).toBe(false);
  });

  it("should support multiple chains", () => {
    const spec1 = specification(gt1)
      .and(gt5)
      .not(gt9);
    const spec2 = specification(gt1)
      .or(gt5)
      .not(gt9);
    const spec3 = specification(gt1)
      .or(gt5)
      .and(gt9);
    const spec4 = specification(gt1)
      .and(gt5)
      .or(gt9);

    expect(spec1.isSatisfiedBy(4)).toBe(false);
    expect(spec1.isSatisfiedBy(6)).toBe(true);
    expect(spec1.isSatisfiedBy(9)).toBe(true);
    expect(spec1.isSatisfiedBy(10)).toBe(false);
    expect(spec2.isSatisfiedBy(4)).toBe(true);
    expect(spec2.isSatisfiedBy(5)).toBe(true);
    expect(spec2.isSatisfiedBy(1)).toBe(false);
    expect(spec2.isSatisfiedBy(9)).toBe(true);
    expect(spec2.isSatisfiedBy(10)).toBe(false);
    expect(spec3.isSatisfiedBy(1)).toBe(false);
    expect(spec3.isSatisfiedBy(5)).toBe(false);
    expect(spec3.isSatisfiedBy(9)).toBe(false);
    expect(spec3.isSatisfiedBy(10)).toBe(true);
    expect(spec4.isSatisfiedBy(1)).toBe(false);
    expect(spec4.isSatisfiedBy(5)).toBe(false);
    expect(spec4.isSatisfiedBy(6)).toBe(true);
    expect(spec4.isSatisfiedBy(9)).toBe(true);
    expect(spec4.isSatisfiedBy(10)).toBe(true);

    const gt15 = greaterThan(15);
    const spec5 = specification(gt1)
      .or(gt9)
      .and(gt5)
      .not(gt15);
    expect(spec5.isSatisfiedBy(10)).toBe(true);
    expect(spec5.isSatisfiedBy(9)).toBe(true);
    expect(spec5.isSatisfiedBy(15)).toBe(true);
    expect(spec5.isSatisfiedBy(6)).toBe(true);
    expect(spec5.isSatisfiedBy(5)).toBe(false);
  });
});
