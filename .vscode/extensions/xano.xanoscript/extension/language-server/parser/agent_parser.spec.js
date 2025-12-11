import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("agent", () => {
  it("should parse a basic agent", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"

      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful AI Agent that completes tasks accurately. When you need additional information to complete a task, use the available tools. Always explain your reasoning and provide clear responses."
        max_steps    : 5
        prompt       : "some prompt"
      }

      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should require a type", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"

      llm = {
        system_prompt: "You are a helpful AI Agent that completes tasks accurately. When you need additional information to complete a task, use the available tools. Always explain your reasoning and provide clear responses."
        max_steps    : 5
        prompt       : "some prompt"
      }

      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should fail on invalid agent type", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"

      llm = {
        type         : "yoyoyo"
        system_prompt: "You are a helpful AI Agent that completes tasks accurately. When you need additional information to complete a task, use the available tools. Always explain your reasoning and provide clear responses."
        max_steps    : 5
        prompt       : "some prompt"
      }

      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse a basic agent with tags", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"
      tags = ["a", "b", "c"]

      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful AI Agent that completes tasks accurately. When you need additional information to complete a task, use the available tools. Always explain your reasoning and provide clear responses."
        max_steps    : 5
        prompt       : "some prompt"
      }

      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse an anthropic agent", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"
      llm = {
        type         : "anthropic"
        system_prompt: "You are a helpful AI Agent that completes tasks accurately."
        max_steps    : 5
        prompt       : """
          some multi-line 
          prompt
          """
        model      : "claude-4-sonnet-20250514"
        temperature: 3
        reasoning  : true
        headers    : "[]"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse an anthropic agent with optional fields", () => {
    const parser = xanoscriptParser(`agent sadf {
      canonical = "blFYWn_e"
      llm = {
        type         : "anthropic"
        system_prompt: "You are a helpful AI Agent."
        max_steps    : 10
        prompt       : "some prompt"
        model      : "claude-4-sonnet-20250514"
        temperature: 0.7
        reasoning  : false
        headers    : "{}"
        api_key    : "test-key"
        thinking_tokens: 1000
        baseURL    : "https://api.anthropic.com"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a google_genai agent", () => {
    const parser = xanoscriptParser(`agent test_google {
      canonical = "test_123"
      llm = {
        type         : "google-genai"
        system_prompt: "You are a Google AI assistant."
        max_steps    : 8
        prompt       : "some prompt"
        model      : "gemini-1.5-pro"
        temperature: 0.5
        reasoning  : true
        headers    : "[]"
        search_grounding: true
        include_thoughts: false
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a google_genai agent with optional fields", () => {
    const parser = xanoscriptParser(`agent test_google {
      canonical = "test_456"
      llm = {
        type         : "google-genai"
        system_prompt: "Advanced Google AI assistant."
        max_steps    : 15
        prompt       : "some prompt"
        model      : "gemini-1.5-flash"
        temperature: 0.8
        reasoning  : false
        headers    : "{}"
        search_grounding: false
        include_thoughts: true
        api_key    : "test-google-key"
        thinking_tokens: 2000
        baseURL    : "https://generativelanguage.googleapis.com"
        safety_settings: "strict"
        dynamic_retrival: "enabled"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should accept a structuredOutput definition", () => {
    const parser = xanoscriptParser(`agent test_google {
      canonical = "test_456"
      llm = {
        type         : "google-genai"
        system_prompt: "Advanced Google AI assistant."
        max_steps    : 15
        prompt       : "some prompt"
        model      : "gemini-1.5-flash"
        temperature: 0.8
        reasoning  : false
        headers    : "{}"
        search_grounding: false
        include_thoughts: true
        api_key    : "test-google-key"
        thinking_tokens: 2000
        baseURL    : "https://generativelanguage.googleapis.com"
        safety_settings: "strict"
        dynamic_retrival: ""
      }
      tools = []

      output {
        text text? filters=trim
        bool is_correct?
        int confidence_score? {
          description = "Max 100"
        }
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse an openai agent", () => {
    const parser = xanoscriptParser(`agent test_openai {
      canonical = "openai_123"
      llm = {
        type         : "openai"
        system_prompt: "You are an OpenAI assistant."
        max_steps    : 6
        prompt       : "some prompt"
        model        : "gpt-4o"
        temperature  : 0.6
        reasoning_effort: "medium"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should reject openai agent with non-existent fields", () => {
    const parser = xanoscriptParser(`agent test_openai {
      canonical = "openai_123"
      llm = {
        type         : "openai"
        system_prompt: "You are an OpenAI assistant."
        max_steps    : 6
        prompt       : "some prompt"
        model        : "gpt-4o"
        temperature  : 0.6
        reasoning_effort: "medium"
        search_grounding: true
      }
      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should reject openai agent with a missing required fields", () => {
    const parser = xanoscriptParser(`agent test_openai {
      canonical = "openai_123"
      llm = {
        type         : "openai"
        system_prompt: "You are an OpenAI assistant."
        max_steps    : 6
        prompt       : "some prompt"
        model        : "gpt-4o"
        temperature  : 0.6
      }
      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse an openai agent with optional fields", () => {
    const parser = xanoscriptParser(`agent test_openai {
      canonical = "openai_456"
      llm = {
        type         : "openai"
        system_prompt: "Advanced OpenAI assistant with custom config."
        max_steps    : 12
        prompt       : "some prompt"
        model      : "gpt-4o-mini"
        temperature: 0.9
        reasoning_effort: "high"
        api_key    : "sk-test-key"
        baseURL    : "https://api.openai.com"
        headers    : "{}"
        organization: "org-123"
        project    : "project-456"
        compatibility: "strict"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a xano_free agent", () => {
    const parser = xanoscriptParser(`agent test_xano {
      canonical = "xano_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a Xano free tier assistant."
        max_steps    : 3
        prompt       : "some prompt"
        temperature: 0.4
        search_grounding: true
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should allow a messages field instead of prompt", () => {
    const parser = xanoscriptParser(`agent test_xano {
      canonical = "xano_789"
      llm = {
        type         : "xano-free"
        system_prompt: "Advanced Xano free tier assistant."
        max_steps    : 7
        messages     : "{{ $args.messages|json_encode() }}"
        temperature: 0.7
        search_grounding: false
        baseURL    : "https://api.xano.com"
        headers    : "{}"
        safety_settings: "moderate"
        dynamic_retrival: "disabled"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should require having at least a prompt or a messages field", () => {
    const parser = xanoscriptParser(`agent test_xano {
      canonical = "xano_789"
      llm = {
        type         : "xano-free"
        system_prompt: "Advanced Xano free tier assistant."
        max_steps    : 7
        temperature: 0.7
        search_grounding: false
        baseURL    : "https://api.xano.com"
        headers    : "{}"
        safety_settings: "moderate"
        dynamic_retrival: "disabled"
      }
      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should reject having both a prompt and messages field", () => {
    const parser = xanoscriptParser(`agent test_xano {
      canonical = "xano_789"
      llm = {
        type         : "xano-free"
        system_prompt: "Advanced Xano free tier assistant."
        max_steps    : 7
        messages     : "{{ $args.messages|json_encode() }}"
        prompt       : "some prompt"
        temperature: 0.7
        search_grounding: false
        baseURL    : "https://api.xano.com"
        headers    : "{}"
        safety_settings: "moderate"
        dynamic_retrival: "disabled"
      }
      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse a xano_free agent with optional fields", () => {
    const parser = xanoscriptParser(`agent test_xano {
      canonical = "xano_789"
      llm = {
        type         : "xano-free"
        system_prompt: "Advanced Xano free tier assistant."
        max_steps    : 7
        prompt       : "some prompt"
        temperature: 0.7
        search_grounding: false
        baseURL    : "https://api.xano.com"
        headers    : "{}"
        safety_settings: "moderate"
        dynamic_retrival: "disabled"
      }
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with single tool", () => {
    const parser = xanoscriptParser(`agent with_tools {
      canonical = "tools_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        prompt       : "some prompt"
        max_steps    : 5
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "calculator"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with multiple tools", () => {
    const parser = xanoscriptParser(`agent multi_tools {
      canonical = "multi_tools_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "calculator"},
        {name: "weather_api"},
        {name: "search_tool"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with active field", () => {
    const parser = xanoscriptParser(`agent tools_active {
      canonical = "active_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "calculator", active: true},
        {name: "weather_api", active: false}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with auth field", () => {
    const parser = xanoscriptParser(`agent tools_auth {
      canonical = "auth_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "api_tool", auth: "bearer_token"},
        {name: "database", auth: "basic_auth"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with all optional fields", () => {
    const parser = xanoscriptParser(`agent tools_all_fields {
      canonical = "all_fields_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {
          name: "advanced_tool"
          active: true
          auth: "oauth2"
        },
        {
          name: "simple_tool"
          active: false
        },
        {
          name: "auth_only_tool"
          auth: "api_key"
        }
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tools with mixed formatting", () => {
    const parser = xanoscriptParser(`agent tools_formatting {
      canonical = "format_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : ""
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "tool1", active: true, auth: "key1"},
        {
          name: "tool2"
          active: false
          auth: "key2"
        },
        {name: "tool3"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should fail when tools missing required name field", () => {
    const parser = xanoscriptParser(`agent tools_missing_name {
      canonical = "missing_123"
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {active: true, auth: "key1"}
      ]
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse agent with description and docs", () => {
    const parser = xanoscriptParser(`agent full_featured {
      canonical = "full_123"
      description = "A fully featured agent with all fields"
      docs = "This is documentation for the agent"
      tags = ["ai", "assistant", "tools"]
      llm = {
        type         : "anthropic"
        system_prompt: "You are a helpful assistant."
        max_steps    : 10
        prompt       : "test"
        model      : "claude-4-sonnet-20250514"
        temperature: 0.7
        reasoning  : true
        headers    : "[]"
      }
      tools = [
        {name: "calculator", active: true},
        {name: "weather", auth: "api_key"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse agent with history clause", () => {
    const parser = xanoscriptParser(`agent with_history {
      canonical = "history_123"
      history = 100
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "tool1"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should allow comments prior to agent declaration", () => {
    const parser = xanoscriptParser(`// This is a comment
// on multiple lines
agent with_history {
      canonical = "history_123"
      history = 100
      llm = {
        type         : "xano-free"
        system_prompt: "You are a helpful assistant."
        max_steps    : 5
        prompt       : "some prompt"
        temperature: 0.5
        search_grounding: true
      }
      tools = [
        {name: "tool1"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });
});
