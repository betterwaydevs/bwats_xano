import {
  defaultParserErrorProvider,
  MismatchedTokenException,
} from "chevrotain";
import { CstParser } from "chevrotain";
import { isArray } from "lodash-es";
import { register } from "./register.js";

// ----------------- Custom Error Provider ------------
const XanoCustomErrorProvider = {
  // buildMismatchTokenMessage: (options) =>
  //   `'${options.expected.name}' expected (${options.ruleName})`,
  buildMismatchTokenMessage:
    defaultParserErrorProvider.buildMismatchTokenMessage,
  buildEarlyExitMessage: defaultParserErrorProvider.buildEarlyExitMessage,

  buildNotAllInputParsedMessage:
    defaultParserErrorProvider.buildNotAllInputParsedMessage,

  buildNoViableAltMessage: defaultParserErrorProvider.buildNoViableAltMessage,
};

// base_parser.js
export class XanoBaseParser extends CstParser {
  constructor(tokenVocabulary) {
    super(tokenVocabulary, {
      errorMessageProvider: XanoCustomErrorProvider,
      recoveryEnabled: false, // fail on first error found
    });
    register(this);
    this.sectionStack = [];
    this.warnings = [];
    this.reset();
  }

  /**
   *  @deprecated - use schemaParseAttributeFn instead
   */
  functionAttrReq() {}

  /**
   * Add a variable to the registry
   * @param {string} name the name of the variable
   * @param {string} type the type of the variable (int, decimal, text, bool, etc)
   * @param {boolean} nullable whether the variable is nullable
   */
  addVariable(name, type, value = null) {
    this.__symbolTable.var[name] = { type, value };
  }

  /**
   * Add an input to the registry
   * @param {string} name
   * @param {string} type
   * @param {boolean} nullable whether the variable is nullable
   */
  addInput(name, type, iterable = false, nullable = false, optional = false) {
    this.__symbolTable.input[name] = { type, iterable, nullable, optional };
  }

  /**
   * Add a warning message to the parser
   * @param {*} message
   * @param {*} token
   */
  addWarning(message, token) {
    token = token || this.LA(0);
    this.warnings.push({ message, token });
  }

  /**
   * Add an information message to the parser
   * @param {*} message
   * @param {*} token
   */
  addInformation(message, token) {
    token = token || this.LA(0);
    this.informations.push({ message, token });
  }

  /**
   * Add a hint message to the parser
   * @param {*} message
   * @param {*} token
   */
  addHint(message, token) {
    token = token || this.LA(0);
    this.hints.push({ message, token });
  }

  /**
   * Add an custom error message when a token is missing
   * @param {import('chevrotain').IToken} token
   * @param {string} message
   */
  addMissingError(token, message) {
    token = token || this.LA(0);

    this.SAVE_ERROR(
      new MismatchedTokenException(message.replaceAll("{}", token.image), token)
    );
  }

  /**
   * Add an error when a required attribute is missing
   * @param {import('chevrotain').IToken} token
   * @param {string[]} missingAttributes
   */
  addMissingAttributeError(token, missingAttributes) {
    token = token || this.LA(0);
    missingAttributes = [].concat(missingAttributes);
    const missing = missingAttributes.join(", ");
    const message =
      missingAttributes.length === 1
        ? `${token.image} is missing the ${missing} attribute`
        : `${token.image} is missing the following attributes: ${missing}`;
    this.SAVE_ERROR(new MismatchedTokenException(message, token));
  }

  /**
   * Add an error when an attribute is not allowed
   * @param {import('chevrotain').IToken} token
   * @param {string} message (optional) the error message
   */
  addIllegalAttributeError(token, message) {
    token = token || this.LA(0);
    if (!message) {
      message = `Attribute \`${token.image}\` is not allowed`;
    }
    this.SAVE_ERROR(new MismatchedTokenException(message, token));
  }

  /**
   * Add an error when an attribute type is not as expected
   * @param {import('chevrotain').IToken} token
   */
  addExpectedValueTypeError(token, expectedType) {
    token = token || this.LA(0);
    this.SAVE_ERROR(
      new MismatchedTokenException(
        `Expected value of \`${token.image}\` to be of type \`${expectedType}\``,
        token
      )
    );
  }

  /**
   * Add an error when an attribute value is not as expected
   * @param {import('chevrotain').IToken} token
   */
  addExpectedValueError(token, expectedType) {
    token = token || this.LA(0);
    if (isArray(expectedType) && expectedType.length > 1) {
      this.SAVE_ERROR(
        new MismatchedTokenException(
          `Expected value of \`${token.image}\` to be one of ${expectedType
            .map((t) => `\`${t}\``)
            .join(", ")}`,
          token
        )
      );
    } else {
      this.SAVE_ERROR(
        new MismatchedTokenException(
          `Expected value of \`${token.image}\` to be \`${expectedType}\``,
          token
        )
      );
    }
  }

  /**
   * Add an error when an attribute is duplicated
   * @param {import('chevrotain').IToken} token
   */
  addDuplicateAttributeError(token) {
    token = token || this.LA(0);
    this.SAVE_ERROR(
      new MismatchedTokenException(
        `Duplicate attribute \`${token.image}\``,
        token
      )
    );
  }

  /**
   * Add an error when a name is duplicated
   * @param {import('chevrotain').IToken} token
   * @param {string} objectType the type of object (e.g., function, table, test, etc.)
   */
  addDuplicateNameError(token, objectType) {
    token = token || this.LA(0);
    if (objectType) {
      this.SAVE_ERROR(
        new MismatchedTokenException(
          `Duplicate ${objectType} name '${token.image}'`,
          token
        )
      );
    } else {
      this.SAVE_ERROR(
        new MismatchedTokenException(`Duplicate name '${token.image}'`, token)
      );
    }
  }

  /**
   * Add an error for invalid values
   * @param {import('chevrotain').IToken} token
   * @param {string} message the error message
   */
  addInvalidValueError(token, message) {
    token = token || this.LA(0);
    this.SAVE_ERROR(new MismatchedTokenException(message, token));
  }

  /**
   * Setup all the required rules for the parser but without creating duplicates
   *
   * @param {function[]} ruleFn rule is a function that returns a rule definition
   */
  requireRules(...ruleFn) {
    for (const fn of ruleFn) {
      if (typeof fn !== "function") {
        throw new Error(
          `requireRules only accepts functions, ${typeof fn} given`
        );
      }

      if (!Object.hasOwn(this, fn.name)) {
        this[fn.name] = this.RULE(fn.name, fn(this));
      }
    }
  }

  reset() {
    super.reset();
    this.sectionStack = [];
    this.warnings = [];
    this.informations = [];
    this.hints = [];
    this.__symbolTable = {
      input: {},
      var: {},
      auth: {},
      env: {},
    };
  }
}
