import { SendEmailToken } from "../../../lexer/util.js";
import { getVarName } from "../../generic/utils.js";

/**
 * util.send_email {
 *   to = "user@example.com"
 *   subject = "Hello"
 *   body = "This is a test email."
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilSendEmailFn($) {
  return () => {
    $.sectionStack.push("utilSendEmailFn");
    const tokenFn = $.CONSUME(SendEmailToken); // "send_email"
    const captured = {};
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        tokenFn,
        {
          "description?": "[string]", // description is optional
          "disabled?": "[boolean]", // disabled is optional
          "service_provider?": ["resend", "xano"], // service_provider is optional
          "api_key?": "[expression]",
          "subject?": "[expression]",
          "message?": "[expression]",
          "to?": "[expression]",
          "bcc?": "[expression]",
          "cc?": "[expression]",
          "from?": "[expression]",
          "reply_to?": "[expression]",
          "scheduled_at?": "[expression]",
          "mock?": { "![string]": "[expression]" },
        },
        captured,
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [tokenFn] });

    const validFieldsPerProvider = {
      xano: [
        "description",
        "disabled",
        "service_provider",
        "subject",
        "message",
        "mock",
      ],
      resend: [
        "description",
        "disabled",
        "service_provider",
        "api_key",
        "subject",
        "message",
        "to",
        "bcc",
        "cc",
        "from",
        "reply_to",
        "scheduled_at",
        "mock",
      ],
    };

    const requiredFieldsPerProvider = {
      xano: ["subject", "message"],
      resend: ["api_key", "subject", "message", "from", "to"],
    };

    $.ACTION(() => {
      const service_provider = getVarName(captured.service_provider?.value);
      const requiredFields = requiredFieldsPerProvider[service_provider] || [];
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(captured, field)) {
          $.addMissingError(
            tokenFn,
            `Missing required field '${field}' for service_provider '${service_provider}'`
          );
        }
      }

      const validFields = validFieldsPerProvider[service_provider] || [];
      const allFields = new Set([
        ...validFieldsPerProvider.xano,
        ...validFieldsPerProvider.resend,
      ]);
      const definedKeys = [];
      for (const field in captured) {
        const fieldValue = getVarName(captured[field].key);
        definedKeys.push(fieldValue);
        if (!allFields.has(fieldValue)) {
          $.addIllegalAttributeError(
            captured[field].key,
            `Field '${fieldValue}' is not allowed in send_email`
          );
        } else if (!validFields.includes(fieldValue)) {
          // in this context the service_provider will not used this field, add a warning
          $.addWarning(
            `${fieldValue} is not used with service_provider '${service_provider}'`,
            captured[field].key
          );
        }
      }
    });
    $.sectionStack.pop();
  };
}
