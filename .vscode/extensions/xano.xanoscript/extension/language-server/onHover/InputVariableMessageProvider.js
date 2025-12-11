import { HoverMessageProvider } from "./HoverMessageProvider.js";

export class InputVariableMessageProvider extends HoverMessageProvider {
  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  isMatch(index, tokens, parser) {
    const token = tokens[index];

    return (
      index > 2 &&
      tokens[index - 2].image === "$input" &&
      tokens[index - 1].image === "." &&
      token.tokenType.name === "Identifier"
    );
  }

  renderUndefined(inputName) {
    return [
      "**Error**: This input is not defined.",
      "Add a definition for it in your `input` clause.",
      "```xs",
      "input {",
      "  text? " + inputName,
      "}",
      "```",
    ].join("\n");
  }

  render(index, tokens, parser) {
    const inputName = tokens[index].image;
    const inputInfo = parser.__symbolTable.input[inputName];

    if (!inputInfo) {
      return this.renderUndefined(inputName);
    } else {
      const type = inputInfo.iterable
        ? `[${inputInfo.type},...]`
        : `${inputInfo.type}`;

      const contents = [`input **${inputName}** of type \`${type}\` `];

      if (inputInfo.nullable) {
        contents.push(`- ${inputName} is _nullable_ (\`${inputInfo.type}?\`)`);
      }

      if (inputInfo.optional) {
        contents.push(`- ${inputName} is _optional_ (\`${inputName}?\`)`);
      }
      return contents.join("\n\n");
    }
  }
}
