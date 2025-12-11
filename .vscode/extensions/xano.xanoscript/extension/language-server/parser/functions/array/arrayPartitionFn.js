import { PartitionToken } from "../../../lexer/arrays.js";

/**
 * Parses the array_partition function.
 *
 * Example:
 * array.partition (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayPartitionFn($) {
  return () => {
    $.sectionStack.push("arrayPartitionFn");
    const parent = $.CONSUME(PartitionToken); // "partition"
    $.SUBRULE($.arrayValueIfAs, {
      ARGS: [parent],
    });
    $.sectionStack.pop();
  };
}
