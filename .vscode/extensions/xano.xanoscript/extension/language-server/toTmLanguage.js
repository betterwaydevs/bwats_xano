import forEach from "lodash-es/forEach.js";
import get from "lodash-es/get.js";
import groupBy from "lodash-es/groupBy.js";
import { allTokens, mapTokenToType } from "./lexer/tokens.js";

/**
 * This is a work in progress to convert the tokens to a TextMate language definition.
 * This is not yet used in the extension but it helps generating the set of regular
 * expressions that are used to match the tokens.
 */


const TmMap = {
  namespace: "entity.name.namespace",
  variable: "variable.other.xanoscript",
  type: "entity.name.type",
  string: "string.quoted.double.xanoscript",
  macro: "entity.name.function.preprocessor",
  number: "constant.numeric.xanoscript",
  function: "support.function.xanoscript",
  enumMember: "variable.other.enummember",
  regexp: "regexp",
  keyword: "support.type.xanoscript",
  operator: "keyword.operator.xanoscript",
  "operator.openingCurly": "keyword.operator.xanoscript",
  "operator.closingCurly": "keyword.operator.xanoscript",
  "operator.openingSquare": "keyword.operator.xanoscript",
  "operator.closingSquare": "keyword.operator.xanoscript",
  "operator.openingParenthesis": "keyword.operator.xanoscript",
  "operator.closingParenthesis": "keyword.operator.xanoscript",
  punctuation: "punctuation",
  method: "entity.name.function.member",
};

function toTmLanguage() {
  const tokens = allTokens.filter((token) => !!token.PATTERN);

  const groupedByType = groupBy(tokens, (token) => mapTokenToType(token.name));

  delete groupedByType["undefined"];
  delete groupedByType["null"];

  const repository = {};

  forEach(groupedByType, (tokens, type) => {
    repository[type] = {
      patterns: [
        {
          name: get(TmMap, type, "keyword.control.xanoscript"),
          match: `${tokens.map((t) => t.PATTERN.source).join("|")}`,
        },
      ],
    };
  });

  return repository;
}

const repository = toTmLanguage();

console.log(
  JSON.stringify(
    {
      name: "XanoScript",
      scopeName: "source.xanoscript",
      fileTypes: [".xs"],
      patterns: Object.keys(repository).map((type) => ({
        include: `#${type}`,
      })),
      repository,
    },
    null,
    2
  )
);
