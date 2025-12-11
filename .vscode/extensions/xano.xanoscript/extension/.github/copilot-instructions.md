# XanoScript VS Code Extension - Copilot Instructions

## Repository Overview

This repository contains the **XanoScript Extension for Visual Studio Code** - a language extension that provides syntax highlighting, code completion, debugging, and workspace integration for XanoScript (.xs files). XanoScript is Xano's proprietary language for building backend logic, APIs, and database operations.

### High-Level Details

- **Project Type**: VS Code Language Extension (TypeScript)
- **Target Runtime**: VS Code Extension Host (Node.js)
- **Languages**: TypeScript (main), JavaScript (build), JSON (config)
- **Framework**: VS Code Extension API, Language Server Protocol
- **Size**: ~200 source files, ~500KB extension bundle
- **External Dependencies**: Xano Language Server (git submodule), Xano Backend Services

## Build Instructions

### Prerequisites

- Node.js 20+ (as specified in CI workflow)
- npm (comes with Node.js)
- Access to language server submodule (requires SSH for git@github.com:xano-labs/xs-language-server.git)

### Essential Build Steps

**ALWAYS run these commands in sequence for a clean build:**

1. **Install Dependencies** (ALWAYS required first):

   ```bash
   npm install
   ```

2. **Initialize Submodule** (required for language server features):

   ```bash
   git submodule update --init --recursive
   ```

3. **Build Snippets** (required before compilation):

   ```bash
   npm run snippets
   ```

4. **TypeScript Compilation**:

   ```bash
   npm run build
   ```

5. **Bundle Extension** (for testing/packaging):
   ```bash
   npm run compile
   ```

### Alternative Build Commands

- `npm run package` - Production build with minification
- `npm run watch` - Development mode with auto-rebuild
- `npm run check-types` - Type checking only (faster validation)

### Build Timing

- `npm install`: ~30-60 seconds
- `npm run build`: ~5-10 seconds
- `npm run compile`: ~5-15 seconds
- `npm run package`: ~10-20 seconds

### Common Build Issues & Solutions

**Import.meta Warnings**: These are expected and safe to ignore - the extension works correctly despite warnings.

## Validation & Testing

### Linting

```bash
npm run lint
```

- Uses ESLint with TypeScript rules
- Configuration: `eslint.config.mjs`
- **ALWAYS** run this before submitting changes

### Testing

```bash
npm test
```

Use Mocha framework with VS Code test runner.

### CI Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. Node.js 20 setup
2. npm install
3. npm run lint
4. npm test (with xvfb for headless testing)

## Project Architecture

### Core Structure

```
src/
├── extension.ts           # Main entry point - registers all components
├── commands/             # Extension commands (login, pull, push, etc.)
├── view/                 # UI components and tree providers
│   ├── files/           # Xano workspace file tree
│   └── changes/         # Git-like changes view
├── registry/            # Core sync logic with Xano backend
├── metadata/            # Data models and API clients
├── snippets/            # XanoScript code snippets (.xs files)
└── tooling/             # Diagnostics and utilities
```

### Configuration Files

- `package.json` - Extension manifest, scripts, dependencies
- `tsconfig.json` - TypeScript configuration
- `esbuild.js` - Bundling configuration (3 targets: extension, server, worker)
- `language-configuration.json` - Language features (brackets, auto-completion)
- `syntaxes/xanoscript.tmLanguage.json` - Syntax highlighting rules
- `.vscode/` - VS Code workspace settings and launch configurations

### Key Architecture Components

1. **Extension Activation** (`src/extension.ts`):

   - Initializes Redux store for user/workspace state
   - Registers commands, views, status bar, watchers
   - Starts language server client

2. **Command System** (`src/commands/`, `src/registerCommands.ts`):

   - All extension commands (40+ commands)
   - Pattern: Each command in separate file, registered in `registerCommands.ts`

3. **View System** (`src/view/`, `src/registerViews.ts`):

   - Two main views: "Changes" (git-like) and "Xano Workspace" (file tree)

4. **Registry System** (`src/registry/`):
   - Core sync logic between local files and Xano backend
   - Handles push/pull operations, conflict resolution, stashing
   - File type detection and metadata extraction

### State Management

- **Redux Store** (`src/actions/`, `src/registerState.ts`): User, Instance, Workspace, Branch
- **VS Code Settings**: `xanoscript.xanoUrl`, `xanoscript.draftMode`
- **Secrets**: Access tokens stored in VS Code secret storage

### Language Server Integration

- External git submodule: `language-server/` (xano-labs/xs-language-server)
- Provides syntax highlighting, hover info, code completion
- Built as separate bundles: `dist/server.js`, `dist/worker.js`

## Dependencies

### Runtime Dependencies

- `vscode` (1.96.0+) - VS Code Extension API
- `vscode-languageclient/vscode-languageserver` - Language Server Protocol
- `redux` - State management
- `lodash` - Utility functions
- `node-fetch` - HTTP requests to Xano API
- `@zip.js/zip.js` - File compression for uploads

### Development Dependencies

- `typescript` (4.0+) - TypeScript compiler
- `esbuild` - Fast bundler
- `eslint` + `typescript-eslint` - Linting
- `@vscode/test-cli` - Testing framework
- `mocha` - Test runner

## Working with This Codebase

### Making Changes

1. **Commands**: Add new commands in `src/commands/`, register in `src/registerCommands.ts`
2. **Views**: Modify tree providers in `src/view/`, register in `src/registerViews.ts`
3. **API Integration**: Update `src/metadata/` for backend changes
4. **Language Features**: Requires changes to language server submodule
5. **UI**: Extension contributes views/commands via `package.json` contributions

### File Locations Quick Reference

- Extension entry: `src/extension.ts`
- Command definitions: `package.json` → contributes.commands
- View definitions: `package.json` → contributes.views
- Settings schema: `package.json` → contributes.configuration
- Language grammar: `syntaxes/xanoscript.tmLanguage.json`
- Build config: `esbuild.js`
- CI config: `.github/workflows/ci.yml`

### Testing Changes

1. Run `npm run lint` (always)
2. Run `npm run build` + `npm run compile`
3. Test in VS Code: Press F5 (uses `.vscode/launch.json`)
4. Run unit tests: `npm test` (if environment supports it)

### Common Patterns

- Commands return Promise<void> and handle errors internally
- UI updates via VS Code tree data providers and refresh events
- State changes dispatch Redux actions
- File operations go through registry system for sync tracking

## Troubleshooting

### "Could not resolve language-server" Error

Create placeholder files: `touch language-server/{server,language-server-worker}.js`

### Build Warnings About import.meta

These are safe to ignore - related to zip.js library in browser context.

### Extension Not Loading

Check `dist/extension.js` exists after `npm run compile`.

### Tests Failing with Display Issues

Tests require VS Code download and display. Use `xvfb-run npm test` on Linux.

---

**Trust these instructions and only search for additional information if details are incomplete or incorrect.**
