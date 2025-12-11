# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (always run first, takes ~2s)
npm install

# Run tests (1041 tests, ~45s - required for CI)
npm test

# Run specific test
npm test -- -g "test name"

# Lint code (required for CI, ~1s)
npm run lint

# Generate TextMate language definition (optional)
npm run tm
```

**Important:** Tests take ~45 seconds. Set adequate timeouts (60+ seconds) for test commands.

## Architecture Overview

This is a Language Server Protocol (LSP) implementation for XanoScript, built on Chevrotain parser generator. The architecture follows: **Lexer → Parser → Language Server Features**.

### Core Components

**Lexer (`lexer/`)**: Token definitions and lexical analysis
- `tokens.js` - Main token registry
- `lexer.js` - Chevrotain lexer implementation
- Domain tokens: `api.js`, `db.js`, `cloud.js`, `function.js`, etc.
- `utils.js` - Token creation utilities (`createToken`, `createTokenByName`)

**Parser (`parser/`)**: Grammar rules and parsing logic
- `base_parser.js` - Core XanoBaseParser extending Chevrotain
- Main parsers: `query_parser.js`, `function_parser.js`, `task_parser.js`, `api_group_parser.js`, `table_parser.js`, `workflow_test_parser.js`, `table_trigger_parser.js`
- `attributes/` - Field attributes (description, disabled, sensitive)
- `clauses/` - Language blocks (stack, input, response, security, auth, cache, history, index, schema, test)
- `definitions/` - Type and column definitions
- `functions/` - Built-in functions organized by domain (api, array, cloud, controls, db, debug, expect, math, object, redis, time, util, variable)
- `generic/` - Reusable parsing components

**Language Server (`server.js` + feature directories)**:
- `onCompletion/` - Auto-completion logic
- `onDidChangeContent/` - Live diagnostics and error reporting
- `onHover/` - Documentation and hover information
- `onSemanticCheck/` - Syntax highlighting token generation

### XanoScript Object Types

Primary constructs parsed by dedicated parsers:
- **query** - API endpoints with HTTP verbs, input validation, processing logic, responses
- **function** - Reusable logic blocks with testing capabilities
- **task** - Scheduled operations with cron-like triggers
- **api_group** - Collections of related API endpoints
- **table** - Database schema definitions with column types
- **workflow_test** - Test definitions for workflows
- **table_trigger** - Database table trigger definitions

## Adding New Features

### New Object Type
1. Create a new parser in `parser/` (e.g., `my_object_parser.js`)
2. Follow existing parser patterns (see `query_parser.js`, `function_parser.js`)
3. Register it in `server.js`

### New Keyword/Function
1. Add token definition in appropriate `lexer/` file
2. Create function implementation in `parser/functions/[domain]/`
3. Register in parent clause or parser
4. Add comprehensive tests in corresponding `.spec.js` file

### Token Creation Pattern
```javascript
export const MyToken = createTokenByName("keyword", {
  longer_alt: Identifier,
  categories: [Identifier],
});
```

### Parser Rule Pattern
```javascript
myRule = this.RULE("myRule", () => {
  this.CONSUME(MyToken);
  this.SUBRULE(this.otherRule);
});
```

## Testing Guidelines

- Tests use Mocha + Chai framework
- 171 test files with `.spec.js` naming convention
- Test structure mirrors source structure
- Real XanoScript examples in `valid_sources/` directories
- Tests are explicit and straightforward - avoid dynamic test generation
- CI requires all tests to pass

### Test Pattern
```javascript
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  const parser = new Parser();
  parser.input = lexResult.tokens;
  parser.myRule();
  return parser;
}
```

## Development Notes

- **Node.js 20+ required** for ES module support
- **No compilation step** - pure JavaScript ES modules
- Use `import`/`export`, not `require()`
- Follow existing code conventions when adding features
- Check neighboring files for patterns and conventions
- Never assume a library is available - check `package.json` first
- 3 low-severity npm audit warnings are known and acceptable