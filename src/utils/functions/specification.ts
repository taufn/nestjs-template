export type PredicateFn = (value?: any) => boolean;
export interface Specification {
  and(predicate: PredicateFn): Specification;
  or(predicate: PredicateFn): Specification;
  not(predicate: PredicateFn): Specification;
  isSatisfiedBy: PredicateFn;
}

export function specification(basePredicate: PredicateFn): Specification {
  return {
    and(predicate: PredicateFn): Specification {
      const check = value => this.isSatisfiedBy(value) && predicate(value);
      return { ...this, isSatisfiedBy: check };
    },
    or(predicate: PredicateFn): Specification {
      const check = value => this.isSatisfiedBy(value) || predicate(value);
      return { ...this, isSatisfiedBy: check };
    },
    not(predicate: PredicateFn): Specification {
      const check = value => this.isSatisfiedBy(value) && !predicate(value);
      return { ...this, isSatisfiedBy: check };
    },
    isSatisfiedBy: basePredicate,
  };
}
