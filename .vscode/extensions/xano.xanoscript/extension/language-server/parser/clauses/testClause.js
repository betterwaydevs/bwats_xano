import { EqualToken, LCurly, RCurly } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import {
  Identifier,
  InputToken,
  NewlineToken,
  TestToken,
} from "../../lexer/tokens.js";
import { DatasourceToken } from "../../lexer/workflow_test.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function testClause($) {
  return (testNames) => {
    let hasInput = false;
    let hasDatasource = false;

    // during parser initialization, testNames is undefined
    testNames = testNames || [];

    $.sectionStack.push("testClause");

    $.CONSUME(TestToken); // test
    const testNameToken = $.OR([
      { ALT: () => $.CONSUME(StringLiteral) }, // "foo"
      { ALT: () => $.CONSUME(Identifier) }, // foo
    ]);

    if (testNameToken && testNameToken.image) {
      const cleanedName = testNameToken.image.replaceAll('"', "");

      if (testNames.includes(cleanedName)) {
        $.addDuplicateNameError(testNameToken, "test");
      }

      testNames.push(testNameToken.image.replaceAll('"', "")); // "test_one" and test_one
    }

    $.CONSUME(LCurly); // "{"
    $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line

    $.MANY(() => {
      $.OR1([
        {
          GATE: () => !hasInput,
          ALT: () => {
            hasInput = true;
            $.CONSUME(InputToken);
            $.CONSUME(EqualToken); // "="
            $.SUBRULE($.objectWithAttributes);
          },
        },
        {
          GATE: () => !hasDatasource,
          ALT: () => {
            hasDatasource = true;
            $.CONSUME(DatasourceToken);
            $.CONSUME1(EqualToken); // "="
            $.CONSUME1(StringLiteral); // "live"
          },
        },
        {
          ALT: () => $.SUBRULE($.unitExpectFn),
        },
      ]);
      $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // at least one new line
    });

    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
