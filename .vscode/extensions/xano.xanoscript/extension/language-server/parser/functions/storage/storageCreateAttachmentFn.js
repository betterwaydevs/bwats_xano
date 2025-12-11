import { CreateAttachmentToken } from "../../../lexer/storage.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function storageCreateAttachmentFn($) {
  return () => {
    $.sectionStack.push("storageCreateAttachmentFn");
    const fnToken = $.CONSUME(CreateAttachmentToken); // "create_attachment"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          value: "[expression]",
          access: ["public", "private"],
          filename: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
