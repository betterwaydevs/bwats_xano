# XanoScript Language Server - Copilot Instructions

## Repository Overview

This repository implements a Language Server Protocol (LSP) server for **XanoScript**, a domain-specific language used by Xano for defining API queries, functions, scheduled tasks, and data schemas. The language server provides VS Code with features like auto-completion, syntax highlighting, hover documentation, and real-time error checking.

**Key Facts:**

- **Size:** ~540 files, 35MB, 457 JavaScript files, 171 test files
- **Language:** JavaScript ES modules (Node.js 20+)
- **Framework:** Chevrotain parser generator + VS Code Language Server Protocol
- **Testing:** Mocha + Chai (1041 tests, comprehensive coverage)
- **Architecture:** Lexer → Parser → Language Server Features

## Build Instructions

### Dependencies and Setup

```bash
npm install  # Install dependencies (~2s, always run before any other commands)
```

### Core Commands

```bash
npm run lint     # ESLint validation (required for CI, ~1s)
npm test         # Run all tests (1041 tests, ~45s, required for CI)
npm test -- -g "test name"  # Run specific tests
npm run tm       # Generate TextMate language definition (optional tool)
```

### Validation Sequence

Always run in this order for reliable builds:

1. `npm install` (always required first)
2. `npm run lint`
3. `npm test`

**Important:** Tests take ~45 seconds to complete. Set adequate timeouts (60+ seconds) for test commands. Clean installs work reliably and are fast after initial package download.

### Build Validation

- **No compilation step required** - pure JavaScript ES modules
- **Node.js 20+ required** (as specified in CI)
- **ES modules** - uses `import`/`export`, requires Node.js with proper module support
- **No build artifacts** - all source files are directly executed

### Common Issues & Workarounds

- **Test timeouts:** Use 60+ second timeouts for `npm test`
- **ES module errors:** Ensure Node.js 20+ with ES module support
- **Dependency conflicts:** Run `rm -rf node_modules && npm install` for clean state
- **3 low-severity npm audit warnings** are known and acceptable

## Project Layout & Architecture

### Core Directories

- **`lexer/`** - Token definitions for XanoScript language elements

  - `tokens.js` - Main token registry and export
  - `lexer.js` - Chevrotain lexer implementation
  - Domain-specific tokens: `api.js`, `db.js`, `cloud.js`, `function.js`, etc.
  - `utils.js` - Token creation utilities (`createToken`, `createTokenByName`)

- **`parser/`** - Grammar rules and parsing logic

  - `base_parser.js` - Core XanoBaseParser extending Chevrotain
  - `query_parser.js`, `function_parser.js`, `task_parser.js` - Main parsers
  - `attributes/` - Field attributes (description, disabled, sensitive, etc.)
  - `clauses/` - Language blocks (stack, input, response, security)
  - `definitions/` - Type and column definitions
  - `functions/` - Built-in function implementations organized by domain
  - `generic/` - Reusable parsing components

- **Language Server Features**
  - `server.js` - Main LSP server setup and capability registration
  - `onCompletion/` - Auto-completion logic and content assist
  - `onDidChangeContent/` - Live diagnostics and error reporting
  - `onHover/` - Documentation and hover information providers
  - `onSemanticCheck/` - Syntax highlighting token generation

### Configuration Files

- **`package.json`** - Dependencies, scripts, ES module configuration
- **`eslint.config.js`** - ESLint configuration (ES modules format)
- **`.github/workflows/ci.yml`** - GitHub Actions CI pipeline
- **`.gitignore`** - Standard Node.js exclusions

### XanoScript Language Structure

XanoScript defines these primary constructs:

- **`query`** - API endpoints with HTTP verbs, input validation, processing logic, responses
- **`function`** - Reusable logic blocks with testing capabilities
- **`task`** - Scheduled operations with cron-like triggers
- **`api_group`** - Collections of related API endpoints
- **`table`** - Database schema definitions with column types

**Core Language Patterns:**

```xs
query my_endpoint verb=GET {
  input { text name filters=trim }
  stack {
    var $result { value = $input.name|upper }
    db.add 123 { data = {name: $result} }
  }
  response = $result
}
```

### Critical Development Patterns

**Token Creation** (in `lexer/` files):

```javascript
export const MyToken = createTokenByName("keyword", {
  longer_alt: Identifier,
  categories: [Identifier],
});
```

**Parser Rules** (in `parser/` files):

```javascript
myRule = this.RULE("myRule", () => {
  this.CONSUME(MyToken);
  this.SUBRULE(this.otherRule);
});
```

**Testing Pattern:**

```javascript
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  const parser = new Parser();
  parser.input = lexResult.tokens;
  parser.myRule();
  return parser;
}
```

### Dependencies & Runtime

- **`chevrotain`** - Parser generator and runtime
- **`vscode-languageserver`** - LSP implementation
- **`lodash-es`** - Utility functions (ES module version)
- **`mocha`/`chai`** - Testing framework
- **Runtime:** Node.js 20+ (ES modules, required for CI compatibility)

### Testing Strategy

- **171 test files** using `.spec.js` naming convention
- **Test organization:** Mirror source structure (`lexer/` tests, `parser/` tests)
- **Example test files:** `lexer/tests/query/valid_sources/`, `parser/tests/function/valid_sources/`
- **Test data:** Real XanoScript files in `valid_sources/` directories
- **CI Integration:** All tests must pass for merge approval

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/ci.yml`):

1. Ubuntu latest, Node.js 20, npm cache enabled
2. `npm install`
3. `npm run lint`
4. `npm test`

**Pre-commit validation:** Lint and test failures block commits. Always run locally before pushing.

### Key Files Reference

- **Root:** `README.md`, `package.json`, `server.js` (main entry)
- **Core Logic:** `lexer/tokens.js`, `parser/base_parser.js`
- **Examples:** `lexer/tests/*/valid_sources/*.xs`, `parser/tests/*/valid_sources/*.xs`
- **Documentation:** `onHover/functions.md` (function documentation)

### Agent Guidelines

1. **Always run `npm install` before any build/test commands**
2. **Use 60+ second timeouts for `npm test`** (1041 tests take time)
3. **Follow existing patterns** - check similar files in same directory for conventions
4. **Test incrementally** - use `npm test -- -g "specific test"` during development
5. **Validate ES module syntax** - use `import`/`export`, not `require()`
6. **Check CI compatibility** - ensure changes work with Node.js 20
7. **Trust these instructions** - comprehensive testing validates all commands work correctly

This language server is production-ready with extensive testing. Focus on understanding the domain-specific language patterns and lexer/parser architecture when making changes.
