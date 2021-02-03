import snakecase = require("lodash.snakecase");

export function caseToWords(
  original: string,
  capitalize?: "first" | "word",
): string {
  const capitalizeFirstLetter = capitalize === "first";
  const capitalizeEachWord = capitalize === "word";
  return snakecase(original)
    .split("_")
    .map((word, i) =>
      capitalizeEachWord || (capitalizeFirstLetter && i === 0)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word,
    )
    .join(" ");
}
