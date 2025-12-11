import { AzureToken } from "../../../lexer/cloud.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAzureFn($) {
  return () => {
    $.sectionStack.push("cloudAzureFn");
    $.CONSUME(AzureToken); // "azure"
    $.CONSUME(DotToken); // "dot"
    $.OR([
      { ALT: () => $.SUBRULE($.cloudStorageFn) }, // "cloud.azure.storage"
    ]);

    $.sectionStack.pop();
  };
}
