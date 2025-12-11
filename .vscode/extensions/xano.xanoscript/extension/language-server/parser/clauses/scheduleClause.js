import { EqualToken } from "../../lexer/control.js";
import { ScheduleToken } from "../../lexer/task.js";

/**
 * schedule = [
 *   {starts_on: 2025-10-14 12:47:59+0000}
 *   {starts_on: 2025-10-14 12:48:02+0000, freq: 86400}
 *   {
 *     starts_on: 2025-10-14 12:48:05+0000
 *     freq     : 259200
 *     ends_on  : 2025-10-14 12:48:05+0000
 *   }
 * ]
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function scheduleClause($) {
  return () => {
    $.sectionStack.push("scheduleClause");
    const parent = $.CONSUME(ScheduleToken); // "schedule"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.schemaFn, {
      ARGS: [
        parent,
        [
          {
            starts_on: "[timestamp]",
            "ends_on?": "[timestamp]",
            "freq?": "[number]",
          },
        ],
      ],
    });

    $.sectionStack.pop();
  };
}
