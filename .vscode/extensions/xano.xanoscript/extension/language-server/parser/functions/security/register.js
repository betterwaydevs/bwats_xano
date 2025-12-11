import { securityCheckPasswordFn } from "./securityCheckPasswordFn.js";
import { securityCreateAuthTokenFn } from "./securityCreateAuthTokenFn.js";
import { securityCreateCurveKeyFn } from "./securityCreateCurveKeyFn.js";
import { securityCreatePasswordFn } from "./securityCreatePasswordFn.js";
import { securityCreateRsaKeyFn } from "./securityCreateRsaKeyFn.js";
import { securityCreateSecretKeyFn } from "./securityCreateSecretKeyFn.js";
import { securityCreateUuidFn } from "./securityCreateUuidFn.js";
import { securityDecryptFn } from "./securityDecryptFn.js";
import { securityEncryptFn } from "./securityEncryptFn.js";
import { securityJweDecodeFn } from "./securityJweDecodeFn.js";
import { securityJweEncodeFn } from "./securityJweEncodeFn.js";
import { securityJwsDecodeFn } from "./securityJwsDecodeFn.js";
import { securityJwsEncodeFn } from "./securityJwsEncodeFn.js";
import { securityRandomBytesFn } from "./securityRandomBytesFn.js";
import { securityRandomNumberFn } from "./securityRandomNumberFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.securityCheckPasswordFn = $.RULE(
    "securityCheckPasswordFn",
    securityCheckPasswordFn($)
  );
  $.securityCreateAuthTokenFn = $.RULE(
    "securityCreateAuthTokenFn",
    securityCreateAuthTokenFn($)
  );
  $.securityCreateCurveKeyFn = $.RULE(
    "securityCreateCurveKeyFn",
    securityCreateCurveKeyFn($)
  );
  $.securityCreatePasswordFn = $.RULE(
    "securityCreatePasswordFn",
    securityCreatePasswordFn($)
  );
  $.securityCreateRsaKeyFn = $.RULE(
    "securityCreateRsaKeyFn",
    securityCreateRsaKeyFn($)
  );
  $.securityCreateSecretKeyFn = $.RULE(
    "securityCreateSecretKeyFn",
    securityCreateSecretKeyFn($)
  );
  $.securityCreateUuidFn = $.RULE(
    "securityCreateUuidFn",
    securityCreateUuidFn($)
  );
  $.securityDecryptFn = $.RULE("securityDecryptFn", securityDecryptFn($));
  $.securityEncryptFn = $.RULE("securityEncryptFn", securityEncryptFn($));
  $.securityJweDecodeFn = $.RULE("securityJweDecodeFn", securityJweDecodeFn($));
  $.securityJweEncodeFn = $.RULE("securityJweEncodeFn", securityJweEncodeFn($));
  $.securityJwsDecodeFn = $.RULE("securityJwsDecodeFn", securityJwsDecodeFn($));
  $.securityJwsEncodeFn = $.RULE("securityJwsEncodeFn", securityJwsEncodeFn($));
  $.securityRandomBytesFn = $.RULE(
    "securityRandomBytesFn",
    securityRandomBytesFn($)
  );
  $.securityRandomNumberFn = $.RULE(
    "securityRandomNumberFn",
    securityRandomNumberFn($)
  );
};
