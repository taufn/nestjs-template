export const passwordRule = {
  minLength: Number(process.env.PASWD_MIN_LENGTH) || 8,
  minAlphabet: Number(process.env.PASWD_MIN_ALPHA) || 1,
  minNumeric: Number(process.env.PASWD_MIN_NUMERIC) || 1,
  minNonAlphanum: Number(process.env.PASWD_MIN_NON_ALPHANUM) || 1,
  skipCharLength: Number(process.env.PASWD_SKIP_CHAR_LEN) || 14,
};
