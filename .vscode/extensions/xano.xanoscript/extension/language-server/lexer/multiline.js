import { createToken } from "chevrotain";

export const MultiLineStringToken = createToken({
  name: '"""..."""',
  pattern:
    /("""\r?\n(?:[\s\S]*?\r?\n)?[ ]*""")|('''\r?\n(?:[\s\S]*?\r?\n)?[ ]*''')/,
});

export const MultiLineExpressionToken = createToken({
  name: "MultiLineExpression",
  pattern: /```\r?\n(?:[\s\S]*?\r?\n)?[ ]*```/,
});
export const MultilineTokens = [MultiLineStringToken, MultiLineExpressionToken];

export function mapTokenToType(token) {
  switch (token) {
    case MultiLineStringToken.name:
      return "tripleString";
    case MultiLineExpressionToken.name:
      return "tripleMacro";
    default:
      return null;
  }
}
