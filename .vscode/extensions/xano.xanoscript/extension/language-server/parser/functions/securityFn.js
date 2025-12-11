import { SecurityToken } from "../../lexer/security.js";
import { DotToken } from "../../lexer/tokens.js";
/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function securityFn($) {
  return () => {
    $.sectionStack.push("security");
    $.CONSUME(SecurityToken); // "security"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.securityCheckPasswordFn) }, // security.check_password
      { ALT: () => $.SUBRULE($.securityCreateAuthTokenFn) }, // security.create_auth_token
      { ALT: () => $.SUBRULE($.securityCreateCurveKeyFn) }, // security.create_curve_key
      { ALT: () => $.SUBRULE($.securityCreatePasswordFn) }, // security.create_password
      { ALT: () => $.SUBRULE($.securityCreateRsaKeyFn) }, // security.create_rsa_key
      { ALT: () => $.SUBRULE($.securityCreateSecretKeyFn) }, // security.create_secret_key
      { ALT: () => $.SUBRULE($.securityCreateUuidFn) }, // security.create_uuid
      { ALT: () => $.SUBRULE($.securityDecryptFn) }, // security.decrypt
      { ALT: () => $.SUBRULE($.securityEncryptFn) }, // security.encrypt
      { ALT: () => $.SUBRULE($.securityJweDecodeFn) }, // security.jwe_decode
      { ALT: () => $.SUBRULE($.securityJweEncodeFn) }, // security.jwe_encode
      { ALT: () => $.SUBRULE($.securityJwsDecodeFn) }, // security.jws_decode
      { ALT: () => $.SUBRULE($.securityJwsEncodeFn) }, // security.jws_encode
      { ALT: () => $.SUBRULE($.securityRandomBytesFn) }, // security.random_bytes
      { ALT: () => $.SUBRULE($.securityRandomNumberFn) }, // security.random_number
    ]);
    $.sectionStack.pop();
  };
}
