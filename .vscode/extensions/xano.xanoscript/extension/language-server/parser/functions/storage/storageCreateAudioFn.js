import { CreateAudioToken } from "../../../lexer/storage.js";

/**
 * storage.create_audio {
 *   value = !input "file"
 *   access = "public"
 *   filename = !text ""
 * } as $x4
 */
export function storageCreateAudioFn($) {
  return () => {
    $.sectionStack.push("storageCreateAudioFn");
    const parent = $.CONSUME(CreateAudioToken); // "create_audio"
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
