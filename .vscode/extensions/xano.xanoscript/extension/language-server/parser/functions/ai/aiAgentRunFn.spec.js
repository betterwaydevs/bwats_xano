import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.aiAgentRunFn();
  return parser;
}

describe("aiAgentRunFn", () => {
  it("should parse ai.agent.run with identifier name", () => {
    const parser = parse(`run my_first_agent {
      args = ""
      allow_tool_execution = true
    } as $my_first_agent1`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with string literal name", () => {
    const parser = parse(`run "My First Agent" {
      args = ""
      allow_tool_execution = true
    } as $my_first_agent1`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with version", () => {
    const parser = parse(`run "My First Agent" {
      args = ""
      allow_tool_execution = true
      version = "v5"
    } as $my_first_agent1`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with complex args expression", () => {
    const parser = parse(`run my_agent {
      args = {}
        |set:"customer_message":""
        |set:"messages":([]
          |push:({}
            |set:"role":"user"
            |set:"content":([]
              |push:({}
                |set:"type":"text"
                |set:"text":"What is Xano?"
              )
            )
          )
        )
      allow_tool_execution = false
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with optional attributes only", () => {
    const parser = parse(`run my_agent as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with disabled attribute", () => {
    const parser = parse(`run my_agent {
      disabled = true
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.agent.run with description", () => {
    const parser = parse(`run my_agent {
      description = "Run my AI agent"
      args = ""
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should allow variable expressions for args", () => {
    const parser = parse(`run my_agent {
      args = $input.agent_args
      allow_tool_execution = $input.allow_tools
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should error on invalid agent name", () => {
    const parser = parse(`run 123 {
      args = ""
    } as $result`);
    expect(parser.errors).to.not.be.empty;
  });
});
