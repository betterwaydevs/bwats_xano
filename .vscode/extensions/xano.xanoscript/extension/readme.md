# XanoScript Extension for Visual Studio Code

**Build secure, scalable backends at lightning speed – right in VS Code or Cursor.**

XanoScript brings the power of Xano's unified backend platform (APIs, data, logic, secure infrastructure, and more) into your favorite code editor. Write and deploy APIs, functions, and database interactions with unprecedented speed and security. No more context-switching between tools – develop, stage, push, and collaborate seamlessly in one place. Whether you're a solo dev or part of a team, XanoScript supercharges your workflow to ship production-ready backends in minutes, not days.

[Xano](https://www.xano.com) is the leading no-code backend platform, trusted by thousands of developers and companies worldwide. With XanoScript, you get the best of both worlds: the flexibility of code with the power and security of Xano's infrastructure.

## Why XanoScript? Get Excited About Rapid, Secure Development

Imagine hovering over code for instant insights, generating full CRUD endpoints with a single command, staging changes with diff views, and pushing to Xano in one click – all while an AI copilot helps you code smarter. XanoScript makes backend development fast, intuitive, and secure by design:

- **Blazing-Fast Iteration**: Prototype and deploy APIs without leaving your editor. Secure auth, data validation, and encryption are built-in, so you focus on features, not boilerplate.
- **Enterprise-Grade Security**: Automatic handling of auth tokens, password hashing, and access controls ensures your apps are secure from day one.
- **AI-Powered Productivity**: Let the copilot suggest code, fix bugs, and optimize logic on the fly.
- **Seamless Xano Integration**: Sync your local files with Xano's cloud – every API endpoint, function, or table becomes a manageable file in your workspace.

Ready to 10x your backend speed? Let's dive in.

## Features in Action

### Instant Insights with Hover Documentation

Hover over any function, keyword, or input variable to get detailed explanations, parameters, and examples. No more digging through docs – knowledge at your fingertips.

![Inline Help](https://storage.googleapis.com/xanoscript-vscode/inline-help.gif)

### Stage, Push, and Diff in One Click

Stage your changes, view visual diffs against your Xano instance, and push updates instantly.

![Stage and Push](https://storage.googleapis.com/xanoscript-vscode/diff-push.gif) <!-- Assuming the GIF name; adjust if needed -->

### Rapid CRUD Endpoint Creation

Generate complete CRUD operations (Create, Read, Update, Delete) plus listing for any database table with a simple VS Code command. Instant scaffolding for your data models.

![CRUD Generation](https://storage.googleapis.com/xanoscript-vscode/crud.gif)

### Develop with AI Copilot

Leverage AI to autocomplete complex logic, refactor code, or even generate an entire solution. It's like having a backend expert by your side.

![AI Copilot](https://storage.googleapis.com/xanoscript-vscode/ai.gif)

Plus, core features to make coding a breeze:

- **Syntax Highlighting**: Vibrant, consistent coloring for XanoScript files (.xs).
- **Code Completion**: Context-aware suggestions as you type.
- **Error Checking and Linting**: Real-time detection to catch issues early.
- **Full Integration**: Native support for Xano's database queries, API calls, and security functions.

## Design Philosophy

XanoScript treats every Xano object (API endpoints, groups, functions, tables) as a local file. The extension syncs these with your Xano workspace, organizing them into a clean folder structure for easy navigation and version control.

## Installation

1. Open VS Code (or Cursor).
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X).
3. Search for "XanoScript" and hit Install.

Or grab the .vsix from our [Extension's page](https://marketplace.visualstudio.com/items?itemName=xano.xanoscript) for manual install.

## Usage

Open a .xs file, and you're off! Connect to your Xano account via the extension settings, then start building.

Quick example: a simple "Hello, World!" API endpoint.

```xanoscript
query hello_world verb=GET {
  description = "Returns a personalized hello world message."

  input {
    text name filters=trim {
      description = "Name of the person to greet."
    }
  }

  stack {
    var $message {
      value = "Hello, " ~ $input.name ~ "! Welcome to the world of Xano."
    }
  }

  response = {
    message: $message
  }

  history = 100
}
```
