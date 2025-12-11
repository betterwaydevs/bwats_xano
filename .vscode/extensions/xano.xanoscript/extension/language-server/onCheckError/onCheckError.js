import { xanoscriptParser } from "../parser/parser.js";
import { getSchemeFromContent } from "../utils.js";

export function onCheckError(text, objectType) {
  const scheme = getSchemeFromContent(objectType ?? text);

  try {
    // Parse the XanoScript file
    const parser = xanoscriptParser(text, scheme);

    if (parser.errors.length === 0) {
      // If parsing succeeds, send an empty diagnostics array (no errors)
      return [];
    }

    // If parsing fails, create a diagnostic (error message) to display in VS Code
    const diagnostics = parser.errors.map((error) => {
      const startOffset = error.token?.startOffset ?? 0;
      const endOffset = error.token?.endOffset ?? 5;
      // Calculate line and character positions from offset
      const lines = text.substring(0, startOffset).split("\n");
      const line = lines.length - 1;
      const character = lines[lines.length - 1].length;

      const endLines = text.substring(0, endOffset + 1).split("\n");
      const endLine = endLines.length - 1;
      const endCharacter = endLines[endLines.length - 1].length;

      return {
        range: {
          start: { line, character },
          end: { line: endLine, character: endCharacter },
        },
        message: error.message,
        source: error.name || "XanoScript Parser",
      };
    });

    return diagnostics;
  } catch (error) {
    console.error("Error checking for XanoScripterrors:", error);
  }
}
