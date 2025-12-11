import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilTemplateFn();
  return parser;
}

describe("utilTemplateFn", () => {
  it("utilTemplateFn accepts data field", () => {
    const parser = parse(`template_engine {
      value = """
        console.log("hello world");
        """
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("utilTemplateFn handles twig controls", () => {
    const parser = parse(`template_engine {
      value = """
        {% set user = {
            'isActive': true,
            'isPending': false
        } %}
        
        {% if user.isActive %}
            Active user
        {% elseif user.isPending %}
            Pending activation
        {% else %}
            Inactive user
        {% endif %}
        """
    } as $elif`);
    expect(parser.errors).to.be.empty;
  });

  it("utilTemplateFn can be disabled", () => {
    const parser = parse(`template_engine {
      value = """
        console.log("hello world");
        """
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("utilTemplateFn can be a single line string", () => {
    const parser = parse(`template_engine {
      value = 'console.log("hello world");'
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("utilTemplateFn accepts a description", () => {
    const parser = parse(`template_engine {
      description = "template function"
      value = """
        console.log("hello world");
        """
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("utilTemplateFn requires a code field", () => {
    const parser = parse(`template_engine {
      description = "template new user"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
