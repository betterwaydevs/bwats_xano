# Change Log

All notable changes to the "xs" extension will be documented in this file.

## [Unreleased]

- `New Tool` command to quickly generate new AI tools for MCP and Agents.
- Complete snippet coverage for all XanoScript constructs

## [0.4.3] - 2025-12-11

- Fix an issue where file watchers could crash when monitoring deleted or inaccessible files.
- Improve error handling for file system operations during workspace synchronization.
- Fix log date format in the CHANGELOG.md

## [0.4.2] - 2025-12-10

- Fix an issue preventing OAuth authentication upon signup.

## [0.4.1] - 2025-12-08

- Address an issue where user would face `Error getting workspace folder for URI` when firing a command while interacting with chat or trees

## [0.4.0] - 2025-12-05

- Address a series of issues related to workspace selection and management.
- Improve the stability and performance of push/pull operations.

## [0.3.10] - 2025-11-26

- Add missing addon.call statement in the Language Server Protocol (LSP) for XanoScript.
- Fix an issue with configuration retrieval when no workspace folder is open.

## [0.3.9] - 2025-11-25

- Address an issue with self-hosted Xano instances where the extension failed due to custom API endpoints.
- Added an option to control filenames prefixing with their unique Xano ID to avoid name conflicts when pulling objects.

## [0.3.8] - 2025-11-24

- Improve reference loss upon push
- Upgrade of the LSP

## [0.3.7] - 2025-11-24

- Prevent file watchers from interfering during a pull

## [0.3.6] - 2025-11-21

- Added a Workspace Selector on the Xano view
- Fixes to push/pull and sync operations

## [0.3.5] - 2025-11-20

- Changes view to Auto select workspace
- Multiple fixes to how files path are handle to handle Ms Windows

## [0.3.3] - 2025-11-17

- Fix push synchronization where newly created resources referencing other new resources could loose their references (e.g. newly created table referencing another newly created table).
- Language Server Protocol (LSP) false negative diagnostics fixed for certain scenarios.
- Improved performance of expression parsing in large files.
