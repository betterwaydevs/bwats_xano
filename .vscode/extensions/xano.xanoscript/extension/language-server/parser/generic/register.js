import { arrayOfObjectAttrReq } from "./arrayOfObjectAttrReq.js";
import { arrayOfStringLiterals } from "./arrayOfStringLiterals.js";
import { arrayWithValues } from "./arrayWithValues.js";
import { assignableVariableAs } from "./assignableVariableAs.js";
import { assignableVariableProperty } from "./assignableVariableProperty.js";
import { asVariable } from "./asVariable.js";
import { booleanValue } from "./booleanValue.js";
import { bracketAccessor, bracketArrayAccessor } from "./bracketAccessor.js";
import { castedValue } from "./castedValue.js";
import {
  chainedIdentifier,
  singleChainedIdentifier,
} from "./chainedIdentifier.js";
import { completeAuthVariable } from "./completeAuthVariable.js";
import { completeEnvVariable } from "./completeEnvVariable.js";
import { completeErrorVariable } from "./completeErrorVariable.js";
import { completeInputVariable } from "./completeInputVariable.js";
import { enumValue } from "./enumValue.js";
import {
  expressionFn,
  expressionTestFn,
  simpleExpressionFn,
} from "./expressionFn.js";
import { filterFn } from "./filterFn.js";
import { functionAttrReq } from "./functionAttrReq.js";
import { longFormVariable } from "./longFormVariable.js";
import { minimalFnBody } from "./minimalFnBody.js";
import { mockAttribute } from "./mockAttribute.js";
import { multilineFilterFn } from "./multilineFilterFn.js";
import { numberValue } from "./numberValue.js";
import { objectAttrReq } from "./objectAttrReq.js";
import { objectWithAttributes } from "./objectWithAttributes.js";
import {
  commentBlockFn,
  optionalCommentBlockFn,
} from "./optionalCommentBlock.js";
import { pipedFilter } from "./pipedFilter.js";
import { requiredValueFnBody } from "./requiredValueFnBody.js";
import { shortFormVariable } from "./shortFormVariable.js";
import { stringArray } from "./stringArray.js";
import { tagsAttribute } from "./tagsAttribute.js";
import { valueExpressionForResponse } from "./valueExpressionForResponse.js";
import { variableOnly } from "./variableOnly.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.mockAttribute = $.RULE("mockAttribute", mockAttribute($));
  $.arrayOfObjectAttrReq = $.RULE(
    "arrayOfObjectAttrReq",
    arrayOfObjectAttrReq($)
  );
  $.arrayOfStringLiterals = $.RULE(
    "arrayOfStringLiterals",
    arrayOfStringLiterals($)
  );
  $.arrayWithValues = $.RULE("arrayWithValues", arrayWithValues($));
  $.assignableVariableAs = $.RULE(
    "assignableVariableAs",
    assignableVariableAs($)
  );
  $.assignableVariableProperty = $.RULE(
    "assignableVariableProperty",
    assignableVariableProperty($)
  );
  $.booleanValue = $.RULE("booleanValue", booleanValue($));
  $.castedValue = $.RULE("castedValue", castedValue($));
  $.chainedIdentifier = $.RULE("chainedIdentifier", chainedIdentifier($));
  $.singleChainedIdentifier = $.RULE(
    "singleChainedIdentifier",
    singleChainedIdentifier($)
  );
  $.enumValue = $.RULE("enumValue", enumValue($));
  $.expressionFn = $.RULE("expressionFn", expressionFn($));
  $.simpleExpressionFn = $.RULE("simpleExpressionFn", simpleExpressionFn($));
  $.expressionTestFn = $.RULE("expressionTestFn", expressionTestFn($));
  $.functionAttrReq = $.RULE("functionAttrReq", functionAttrReq($));
  $.filterFn = $.RULE("filterFn", filterFn($));
  $.multilineFilterFn = $.RULE("multilineFilterFn", multilineFilterFn($));
  $.longFormVariable = $.RULE("longFormVariable", longFormVariable($));
  $.minimalFnBody = $.RULE("minimalFnBody", minimalFnBody($));
  $.numberValue = $.RULE("numberValue", numberValue($));
  $.objectAttrReq = $.RULE("objectAttrReq", objectAttrReq($));
  $.objectWithAttributes = $.RULE(
    "objectWithAttributes",
    objectWithAttributes($)
  );
  $.pipedFilter = $.RULE("pipedFilter", pipedFilter($));
  $.requiredValueFnBody = $.RULE("requiredValueFnBody", requiredValueFnBody($));
  $.shortFormVariable = $.RULE("shortFormVariable", shortFormVariable($));
  $.stringArray = $.RULE("stringArray", stringArray($));
  $.tagsAttribute = $.RULE("tagsAttribute", tagsAttribute($));
  $.expressionFnForResponse = $.RULE(
    "valueExpressionForResponse",
    valueExpressionForResponse($)
  );
  $.variableOnly = $.RULE("variableOnly", variableOnly($));
  $.completeAuthVariable = $.RULE(
    "completeAuthVariable",
    completeAuthVariable($)
  );
  $.bracketAccessor = $.RULE("bracketAccessor", bracketAccessor($));
  $.bracketArrayAccessor = $.RULE(
    "bracketArrayAccessor",
    bracketArrayAccessor($)
  );
  $.completeInputVariable = $.RULE(
    "completeInputVariable",
    completeInputVariable($)
  );
  $.completeErrorVariable = $.RULE(
    "completeErrorVariable",
    completeErrorVariable($)
  );
  $.completeEnvVariable = $.RULE("completeEnvVariable", completeEnvVariable($));
  $.asVariable = $.RULE("asVariable", asVariable($));
  $.optionalCommentBlockFn = $.RULE(
    "optionalCommentBlockFn",
    optionalCommentBlockFn($)
  );
  $.commentBlockFn = $.RULE("commentBlockFn", commentBlockFn($));
};
