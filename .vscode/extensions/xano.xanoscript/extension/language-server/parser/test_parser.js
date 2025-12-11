import { allTokens } from "../lexer/tokens.js";
import { XanoBaseParser } from "./base_parser.js";
import { parserExtension as schemaFnExtension } from "./functions/schema/schemaFn.spec.js";
import { parserExtension as schemaParseArrayFnExtension } from "./functions/schema/schemaParseArrayFn.spec.js";
import { parserExtension as schemaParseAttributeFnExtension } from "./functions/schema/schemaParseAttributeFn.spec.js";
import { parserExtension as schemaParseConstantFnExtension } from "./functions/schema/schemaParseConstantFn.spec.js";
import { parserExtension as schemaParseEnumFnExtension } from "./functions/schema/schemaParseEnum.spec.js";
import { parserExtension as schemaParseImmutableFnExtension } from "./functions/schema/schemaParseImmutableFn.spec.js";
import { parserExtension as schemaParseObjectFnExtension } from "./functions/schema/schemaParseObjectFn.spec.js";
import { parserExtension as arrayOfObjectAttrReqExtension } from "./generic/arrayOfObjectAttrReq.spec.js";
import { parserExtension as functionAttrReqExtension } from "./generic/functionAttrReq.spec.js";
import { parserExtension as objectAttrReqExtension } from "./generic/objectAttrReq.spec.js";
import { parserExtension as objectWithAttributesExtension } from "./generic/objectWithAttributes.spec.js";

/**
 * This parser is used by our unit-tests, it loads
 * custom rules used in various tests and not part of
 * the main parser.
 */
class TestParser extends XanoBaseParser {
  constructor() {
    super(allTokens);
    schemaFnExtension.bind(this)();
    schemaParseArrayFnExtension.bind(this)();
    schemaParseConstantFnExtension.bind(this)();
    schemaParseObjectFnExtension.bind(this)();
    schemaParseEnumFnExtension.bind(this)();
    schemaParseImmutableFnExtension.bind(this)();
    arrayOfObjectAttrReqExtension.bind(this)();
    functionAttrReqExtension.bind(this)();
    objectAttrReqExtension.bind(this)();
    objectWithAttributesExtension.bind(this)();
    schemaParseAttributeFnExtension.bind(this)();

    this.performSelfAnalysis();
  }
}

export const parser = new TestParser();
