import { CreateVideoToken } from "../../../lexer/storage.js";

/**
 * storage.create_video {
 *   value = !input "file"
 *   access = "public"
 *   filename = !text ""
 * } as $x4
 */
export function storageCreateVideoFn($) {
  return () => {
    $.sectionStack.push("storageCreateVideoFn");
    const parent = $.CONSUME(CreateVideoToken); // "create_video"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parent,
        {
          value: "[expression]",
          "access?": ["public", "private"],
          "filename?": "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
