/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function variableOnly($) {
  return () => {
    $.OR([
      { ALT: () => $.SUBRULE($.longFormVariable) }, // "$var.users"
      { ALT: () => $.SUBRULE($.shortFormVariable) }, // "$users"
    ]);
    $.OPTION(() => $.SUBRULE($.pipedFilter));
  };
}
