import { passwordRule } from "../values";
import { PredicateFn } from "~/utils/functions";

export const passwordMinLength: PredicateFn = (value: string): boolean =>
  value.length > passwordRule.minLength;

export const passwordIsLongEnough: PredicateFn = (value: string): boolean =>
  value.length > passwordRule.skipCharLength;

export const passwordMinLetter: PredicateFn = (value: string): boolean =>
  value.match(/^[a-zA-Z]+$/gi)?.length > passwordRule.minAlphabet;

export const passwordMinNumeric: PredicateFn = (value: string): boolean =>
  value.match(/^\d+$/)?.length > passwordRule.minNumeric;

export const passwordMinSpecialChar: PredicateFn = (value: string): boolean =>
  value.match(/[\W_]+/g)?.length > passwordRule.minNonAlphanum;
