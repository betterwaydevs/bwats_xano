[![CI](https://github.com/xano-labs/xs-language-server/actions/workflows/ci.yml/badge.svg)](https://github.com/xano-labs/xs-language-server/actions/workflows/ci.yml)

# XanoScript Language Server

The language server is based on [Chevrotain](https://chevrotain.io/), a powerful parsing library for JavaScript.

Maintainers are:

- [Brice Leroy](mailto:brice.l@xano.com) - [on Slack](https://xano.slack.com/archives/D06T7HZ2DTK)
- [Shawn Chambers](mailto:shawn.c@xano.com) - [on Slack](https://xano.slack.com/archives/D06U8B1RHBQ)

## File structure

- `lexer/`: Contains the lexer implementation, including token definitions and the lexer itself.
- `parser/`: Contains the parser implementation, including grammar definitions and the main parser class.

To integrate the language server with 3rd party tools, we also have a `server.js` file that sets up the language server and handles communication with clients.

- `onCompletion/`: Contains the implementation for the completion feature, allowing the language server to provide suggestions for code completion.
- `onDidChangeContent/`: Runs a diagnostic analysis on the content of the xanoscript (allow the editor to show errors + error message)
- `onHover/`: Provides hover information for symbols in the xanoscript, such as type information and documentation.
- `onSemanticCheck/`: Provides the highlight syntax for Xanoscript to the editor.

## How do I add a new object type?

Every new object requires a new parser in the `parser/` folder. Use one of our existing parser (`query_parser.js`, `function_parser.js`...) to create yours. Once created, you'll have to add it to `server.js`.

## How do I add a new keyword/function ?

We have a hierarchy for the different statements Xanoscript uses.

1. Parser: this is the top level, we have a Query parser, function parser, etc.
2. Clause: this is the main blocks in a given object type, could be stack, response, input...
3. functions: this would be a statement, like a `debug.log` or `db.query`
4. `attributes`, `definitions` would come next as component you can use to define your functions
5. `generic` is used by all the other statement, like a toolset for language.

## Testing

The language server is heavily tested and should remain that way as it grows. Test should be easy to copy, paste, extends. Avoid dynamic test (like using a loop), your test should be straightforward, easy to read, easy to understand, trustworthy.

To run the tests:

```sh
npm test
```

To run a specific test

```sh
npm test -- -g "my test name"
```

## CI-CD

On commit, the CI/CD pipeline will run all tests and linting checks to ensure code quality. If any tests fail, the commit will be rejected until the issues are resolved.

You'll find the configuration of the action in the `.github/workflows/ci.yml` file.
