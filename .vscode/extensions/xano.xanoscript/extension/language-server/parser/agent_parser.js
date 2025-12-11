import { AgentToken, LLMToken, ToolsToken } from "../lexer/agent.js";
import { CommentToken } from "../lexer/comment.js";
import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";
import { getVarName } from "./generic/utils.js";

export function agentDeclaration($) {
  return () => {
    let hasCanonical = false;
    let hasDescription = false;
    let hasDocs = false;
    let hasHistory = false;
    let hasLLM = false;
    let hasTags = false;
    let hasTools = false;
    let hasOutput = false;

    $.sectionStack.push("agentDeclaration");
    // Allow leading comments and newlines before the agent declaration
    $.SUBRULE($.optionalCommentBlockFn);
    const parent = $.CONSUME(AgentToken); // agent
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      // Allow comments between newlines and clauses
      $.MANY4(() => $.CONSUME5(CommentToken));
      $.MANY5(() => $.CONSUME6(NewlineToken)); // more newlines after comments
      $.OR2([
        {
          ALT: () => $.SUBRULE($.commentBlockFn),
        },
        {
          GATE: () => !hasCanonical,
          ALT: () => {
            hasCanonical = true;
            $.SUBRULE($.canonicalClause);
          },
        },
        {
          GATE: () => !hasDescription,
          ALT: () => {
            hasDescription = true;
            $.SUBRULE($.descriptionFieldAttribute);
          },
        },
        {
          GATE: () => !hasDocs,
          ALT: () => {
            hasDocs = true;
            $.SUBRULE($.docsFieldAttribute);
          },
        },
        {
          GATE: () => !hasHistory,
          ALT: () => {
            hasHistory = true;
            $.SUBRULE($.historyClause);
          },
        },
        {
          GATE: () => !hasLLM,
          ALT: () => {
            hasLLM = true;

            const subParent = $.CONSUME(LLMToken); // "llm"
            $.CONSUME(EqualToken); // "="

            // required keys aside from the already required "type", "max_steps" and "prompt"
            const requiredFieldsPerSource = {
              anthropic: [
                "type",
                "max_steps",
                "model",
                "temperature",
                "headers",
              ],
              "google-genai": [
                "type",
                "max_steps",
                "model",
                "temperature",
                "headers",
                "search_grounding",
                "include_thoughts",
              ],
              openai: [
                "type",
                "max_steps",
                "model",
                "temperature",
                "reasoning_effort",
              ],
              xano_free: [
                "type",
                "max_steps",
                "temperature",
                "search_grounding",
              ],
            };

            const validFieldsPerSource = {
              anthropic: [
                ...requiredFieldsPerSource.anthropic,
                "system_prompt",
                "prompt",
                "messages",
                "api_key",
                "reasoning",
                "thinking_tokens",
                "baseURL",
              ],
              "google-genai": [
                ...requiredFieldsPerSource["google-genai"],
                "system_prompt",
                "prompt",
                "messages",
                "api_key",
                "thinking_tokens",
                "baseURL",
                "safety_settings",
                "dynamic_retrival",
                "reasoning",
              ],
              openai: [
                ...requiredFieldsPerSource.openai,
                "system_prompt",
                "prompt",
                "messages",
                "api_key",
                "baseURL",
                "headers",
                "organization",
                "project",
                "compatibility",
              ],
              "xano-free": [
                ...requiredFieldsPerSource["xano_free"],
                "system_prompt",
                "prompt",
                "messages",
                "baseURL",
                "headers",
                "safety_settings",
                "dynamic_retrival",
                "thinking_tokens",
                "include_thoughts",
              ],
            };

            const captured = {};
            $.SUBRULE($.schemaParseObjectFn, {
              ARGS: [
                subParent,
                {
                  type: ["anthropic", "google-genai", "openai", "xano-free"],
                  max_steps: "[number]",
                  // prompt and message are exclusive (at least one but not both), but we'll validate that
                  // after parsing
                  "prompt?": "[string]",
                  "messages?": "[string]",
                  // all the following fields are optional because we'll validate
                  // required and allowed fields per source below
                  "api_key?": "[string]",
                  "baseURL?": "[string]",
                  "compatibility?": ["strict", "compatible", ""],
                  "dynamic_retrival?": ["enabled", "disabled", ""],
                  "headers?": "[string]",
                  "include_thoughts?": "[boolean]",
                  "model?": "[string]",
                  "organization?": "[string]",
                  "project?": "[string]",
                  "reasoning_effort?": "[string]",
                  "reasoning?": "[boolean]",
                  "safety_settings?": "[string]",
                  "search_grounding?": "[boolean]",
                  "system_prompt?": "[string]",
                  "temperature?": "[number]",
                  "thinking_tokens?": "[number]",
                },
                captured,
              ],
            });
            // Because each LLM source has different required fields,
            // we need to validate them here after parsing
            $.ACTION(() => {
              // schemaParseObjectFn should have ensured type exists and is
              // a valid string at this point. schemaParseObjectFn also mutates
              // captured to contain the parsed keys and values.
              const llmType = getVarName(captured.type?.value);
              const requiredFields = requiredFieldsPerSource[llmType] || [];
              for (const field of requiredFields) {
                if (!Object.prototype.hasOwnProperty.call(captured, field)) {
                  $.addMissingError(
                    subParent,
                    `llm of type "${llmType}" requires a "${field}" field`
                  );
                }
              }
              const validFields = validFieldsPerSource[llmType] || [];
              const definedKeys = [];
              for (const field in captured) {
                const fieldValue = getVarName(captured[field].key);
                definedKeys.push(fieldValue);
                if (!validFields.includes(fieldValue)) {
                  $.addIllegalAttributeError(captured[field].key);
                }
              }

              const hasPrompt = definedKeys.includes("prompt");
              const hasMessages = definedKeys.includes("messages");
              if (hasPrompt && hasMessages) {
                $.addIllegalAttributeError(
                  captured["messages"].key,
                  `llm of type "${llmType}" cannot have both "prompt" and "messages" fields`
                ); // both cannot be present
              } else if (!hasPrompt && !hasMessages) {
                $.addMissingError(
                  subParent,
                  `llm of type "${llmType}" requires either a "prompt" or "messages" field`
                );
              }
            });
          },
        },
        {
          GATE: () => !hasTags,
          ALT: () => {
            hasTags = true;
            $.SUBRULE($.tagsAttribute);
          },
        },
        {
          GATE: () => !hasOutput,
          ALT: () => {
            hasOutput = true;
            $.SUBRULE($.outputClause);
          },
        },
        {
          GATE: () => !hasTools,
          ALT: () => {
            hasTools = true;

            const subParent = $.CONSUME(ToolsToken); // "tools"
            $.CONSUME2(EqualToken); // "="

            // [{"name":"tool_name"}]
            $.SUBRULE($.arrayOfObjectAttrReq, {
              ARGS: [
                subParent,
                ["name"], // required
                ["active", "auth"], // optional
                {
                  types: {
                    active: "boolean",
                    auth: "string",
                    name: "string",
                  },
                },
              ],
            });
          },
        },
      ]);
    });

    if (!hasLLM) {
      $.addMissingError(parent, "{} is missing llm clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
