# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Build the extension
npm run compile

# Watch mode for continuous building during development
npm run watch

# Build for production (used before packaging)
npm run package

# Run tests
npm run test

# Lint code
npm run lint

# Check TypeScript types without building
npm run check-types

# Generate code snippets
npm run snippets

# Package extension for distribution
npm run build-patch
```

## Architecture Overview

This is a VS Code extension for **XanoScript**, a domain-specific language for backend API development. The extension integrates with the Xano platform for cloud-based backend development.

### Core Structure (`src/`)

**Extension Entry Point**

- `src/extension.ts` - Main activation point, orchestrates all features

**Commands (`src/commands/`)**
User-facing operations exposed through VS Code command palette:

- Authentication: `login.ts`
- Workspace management: `selectWorkspace.ts`, `selectBranch.ts`, `selectInstance.ts`
- Sync operations: `pull.ts`, `push.ts`, `refreshChanges.ts`, `resetAndPull.ts`
- File management: `createApiEndpoint.ts`, `createTable.ts`, `createTask.ts`, `createCustomFunction.ts`, `createWorkflowTest.ts`
- Change tracking: `stageRecord.ts`, `unstageRecord.ts`, `stageAllRecords.ts`, `discardChanges.ts`
- Diff views: `viewChangeDiff.ts`, `viewRemoteDiff.ts`

**Metadata API (`src/metadata/`)**
Interfaces with Xano backend APIs for each object type:

- `api.ts` - API endpoint operations
- `customFunction.ts` - Custom function management
- `table.ts` - Database table operations
- `task.ts` - Scheduled task management
- `workflowTest.ts` - Test workflow operations
- `workspace.ts` - Workspace-level operations
- `open-API-specs.json` - OpenAPI specification for extending API functionality
- `request.ts` - HTTP request utilities
- `login.ts` - Authentication handling

**Registry (`src/registry/`)**
Local XanoScript version management system (similar to Git but simplified):

- `registry.ts` - Core registry operations
- `pull.ts` - Download changes from remote Xano workspace
- `push.ts` - Upload local changes to remote Xano workspace
- `sync.ts` - Synchronization logic between local and remote
- `stash.ts` - Temporary change storage
- `getFileInfo.ts` - Extract metadata from XanoScript files
- `fsUtils.ts` - File system utilities
- `xsUtils.ts` - XanoScript-specific utilities

**Documentation (`src/docs/`)**
AI tool documentation exposed through Language Model Tools:

- `syntax.md` - XanoScript language syntax reference
- `functions.md` - Built-in function documentation
- `function_guideline.md` - Best practices for writing functions
- `api_query_guideline.md` - API query development guidelines
- `table_guideline.md` - Database table design guidelines
- `task_guideline.md` - Task scheduling guidelines
- `unit_testing_guideline.md` - Testing best practices
- `frontend.md` - Frontend integration documentation

**Views (`src/view/`)**
Custom VS Code tree views:

- `files/` - Workspace file browser showing XanoScript objects
- `changes/` - Change tracking interface (staged/unstaged changes)
- Content providers for diff views

**Other Key Components**

- `src/snippets/` - VS Code code snippets for XanoScript
- `src/tooling/` - GitHub Copilot integration tools
- `src/templates/` - Code generation templates

### Language Server Integration

The `language-server/` directory is a **Git submodule** with its own repository. It provides:

- Language support (syntax highlighting, completion, hover, diagnostics)
- XanoScript parser and lexer
- Should be developed in its own repository

### Build System

**esbuild Configuration** (`esbuild.js`):

- Builds extension client: `src/extension.ts` → `dist/extension.js`
- Builds language server: `language-server/server.js` → `dist/server.js`
- Builds language server worker: `language-server/language-server-worker.js` → `dist/worker.js`
- Production mode includes minification and tree shaking

## XanoScript Object Types

The extension manages these XanoScript constructs:

- **APIs** (`apis/`) - HTTP endpoints with routing, input validation, business logic
- **Functions** (`functions/`) - Reusable code blocks
- **Tables** (`tables/`) - Database schema definitions
- **Tasks** (`tasks/`) - Scheduled operations
- **Workflow Tests** (`workflow_tests/`) - API testing workflows

## Development Guidelines

### Adding New Commands

1. Create command handler in `src/commands/`
2. Register in `registerCommands.ts`
3. Add to `package.json` contributions if user-facing

### Adding Metadata API Support

1. Create interface in `src/metadata/` following existing patterns
2. Use `open-API-specs.json` for API structure reference
3. Implement CRUD operations following existing conventions

### Registry Operations

- **Pull**: Download latest from Xano workspace
- **Push**: Upload staged changes to Xano workspace
- **Stage/Unstage**: Mark changes for push (like `git add`)
- **Stash**: Temporary storage for work-in-progress

### AI Tools Integration

- Documentation in `src/docs/` is exposed as Language Model Tools
- 8 tools available: syntax docs, function lexicon, guidelines, CRUD generation
- Tools are registered in `registerChatTools.ts`

## VS Code Integration Features

**Package.json Contributions**:

- 25+ commands for workspace management
- Custom views in activity bar (XanoScript sidebar)
- Language configuration for `.xs` files
- 8 Language Model Tools for AI integration

**Key Features**:

- Custom tree views for workspace navigation and change tracking
- Diff views for conflict resolution
- Status bar integration showing workspace/branch status
- File watchers for auto-refresh on changes

## Development Notes

- Focus development on `src/` folder structure
- Language server development should be done in its own repository (submodule)
- Registry system provides Git-like workflow for Xano cloud sync
- Metadata APIs follow OpenAPI specification in `src/metadata/open-API-specs.json`
- Run lint and type checking before committing changes

## When adding a new XanoScript object type

1. Create the API interface for the object in the src/metadata folder
2. Use the specs from src/metadata/open-API-specs.json
3. Once created, add the default path for the object in config.ts
4. Add the object to the enum XanoObjectType in src/registry/registry.ts
5. Add the object to the switch statement in getObjectTypeFromPath in src/registry/registry.ts
6. Add the object to the pull and push modules in src/registry/pull.ts and src/registry/push.ts
7. Add the mocks for the object in src/registry/pull.test.ts and src/registry/push.test.ts
8. Add the commands to create the object in src/commands
9. Register the commands in src/commands/registerCommands.ts and package.json
10. Add the new object type to sync registry flow src/registry/init.ts
11. Add the new object to onDidSaveTextDocument watcher in src/extension.ts
