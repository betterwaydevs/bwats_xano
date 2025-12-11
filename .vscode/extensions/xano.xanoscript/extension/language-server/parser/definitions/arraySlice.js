import { ColonToken, LSquare, RSquare } from "../../lexer/control.js";
import { IntegerLiteral } from "../../lexer/literal.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function arraySlice($) {
  return () => {
    $.sectionStack.push("arraySlice");
    let startIndex = null;
    let endIndex = null;

    $.OR([
      {
        ALT: () => {
          // [] - the complete array
          $.CONSUME(LSquare);
          $.CONSUME(RSquare);
        },
      },
      {
        ALT: () => {
          // [1:] or [1:2] - start at index 1, to the end or to index 2
          $.CONSUME1(LSquare); // "["
          startIndex = $.CONSUME1(IntegerLiteral); // start index
          $.CONSUME1(ColonToken); // ":"
          // optional end index
          $.OPTION(() => (endIndex = $.CONSUME3(IntegerLiteral))); // optional end index
          $.CONSUME1(RSquare); // "]"
        },
      },
      {
        ALT: () => {
          // [:3] - start at index 0, to index 3
          $.CONSUME2(LSquare); // "["
          $.CONSUME2(ColonToken); // ":"
          endIndex = $.CONSUME2(IntegerLiteral); // end index
          $.CONSUME2(RSquare); // "]"
        },
      },
    ]);

    if (startIndex && startIndex.image.startsWith("-")) {
      $.addInvalidValueError(
        startIndex,
        `Array slice start index cannot be negative`
      );
    }

    if (endIndex && endIndex.image.startsWith("-")) {
      $.addInvalidValueError(
        endIndex,
        `Array slice end index cannot be negative`
      );
    }

    if (startIndex && endIndex) {
      const start = parseInt(startIndex.image, 10);
      const end = parseInt(endIndex.image, 10);
      if (end < start) {
        $.addInvalidValueError(
          endIndex,
          `Array slice end index cannot be less than start index`
        );
      }
    }

    $.sectionStack.pop();
  };
}
