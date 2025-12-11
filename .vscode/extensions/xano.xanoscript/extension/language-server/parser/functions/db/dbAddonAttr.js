import { addonSchema } from "./schema.js";

/**
 * Database Addon Attribute Parser
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbAddonAttr($) {
  return (parent) => {
    $.sectionStack.push("dbAddonAttr");
    $.SUBRULE($.schemaFn, {
      // allows an array of addon definitions
      ARGS: [parent, [addonSchema]],
    });

    $.sectionStack.pop();
  };
}
