# Embedded JavaScript/TypeScript Support

This folder contains the server-side (JavaScript) implementation for recognizing and handling embedded JavaScript/TypeScript code within XanoScript `api.lambda` statements.

## Files

### `embeddedContent.js`
Core extraction and mapping logic:
- `extractEmbeddedJS(text)` - Finds all `code = """..."""` blocks in XanoScript
- `mapToVirtualJS(offset, text)` - Maps cursor position to embedded JS region
- `mapFromVirtualJS(virtualOffset, region)` - Maps from JS position back to XanoScript
- `isInEmbeddedRegion(offset, text)` - Quick check if position is in JS

### `embeddedDocuments.js`
Virtual document manager:
- `EmbeddedDocumentManager` class - Tracks virtual documents per file
- Singleton `embeddedDocuments` instance for global access

### `jsLanguageService.js`
Language service coordinator:
- `JSLanguageService` class - Coordinates JS features
- Helper methods for checking regions and updating documents
- Singleton `jsLanguageService` instance

## How It Works

When a user types in a `.xs` file with embedded JavaScript:

```xanoscript
api.lambda {
  code = """
    console.log("hello");
    const result = [1, 2, 3].map(x => x * 2);
  """
  timeout = 10
}
```

1. **Detection**: The regex pattern `/code\s*=\s*"""\s*\n([\s\S]*?)\n\s*"""/g` finds the JavaScript content
2. **Extraction**: `extractEmbeddedJS()` returns regions with `{content, offset, end}`
3. **Delegation**: When completion/hover is requested in a JS region:
   - `onCompletion.js` and `onHover.js` call `mapToVirtualJS()`
   - If inside JS, they return `null`
   - This tells VS Code to use its own JavaScript language service
4. **Virtual Documents**: The client-side (TypeScript) creates virtual documents that VS Code's JS service can process

## Usage

### In Language Server Files

```javascript
import { mapToVirtualJS } from "../embedded/embeddedContent.js";

export function onCompletion(params, documents) {
  const document = documents.get(params.textDocument.uri);
  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // Check if we're in embedded JS
  const virtualPos = mapToVirtualJS(offset, text);
  if (virtualPos) {
    // Let VS Code's JS service handle it
    return null;
  }
  
  // Otherwise, handle as regular XanoScript
  return getXanoScriptCompletions(text, offset);
}
```

## Pattern Matching

The regex pattern is intentionally simple:
- `code\s*=\s*"""` - Matches `code = """`  with flexible whitespace
- `\s*\n` - Optional whitespace before newline
- `([\s\S]*?)` - **Capture group**: Any characters (including newlines), non-greedy
- `\n\s*"""` - Newline and closing triple quotes

This works in any context (not just `api.lambda`), making it flexible for future extensions.

## Client-Side vs Server-Side

- **Server-side** (this folder): JavaScript implementation used by language server
- **Client-side** (`src/tooling/js_embedding.ts`): TypeScript implementation used by VS Code extension
- Both implement the same extraction logic but in their respective environments

## Testing

All modules are ES6 modules and can be tested independently:

```bash
cd language-server
node -e "import('./embedded/embeddedContent.js').then(m => console.log(m.extractEmbeddedJS('code = \"\"\"\\nconsole.log()\\n\"\"\"')))"
```

## Future Enhancements

Potential additions:
- Support for SQL in `db.query { sql = """...""" }`
- Support for HTML/CSS in template literals
- Multiple embedded regions per line
- Nested language detection
