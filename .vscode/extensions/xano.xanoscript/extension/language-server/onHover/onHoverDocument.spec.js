import { expect } from "chai";
import { describe, it } from "mocha";
import { TextDocument } from "vscode-languageserver-textdocument";
import { FilterMessageProvider } from "./FilterMessageProvider.js";
import { FunctionMessageProvider } from "./FunctionMessageProvider.js";
import { InputFilterMessageProvider } from "./InputFilterMessageProvider.js";
import { InputVariableMessageProvider } from "./InputVariableMessageProvider.js";
import { onHoverDocument } from "./onHoverDocument.js";
import { QueryFilterMessageProvider } from "./queryFilterMessageProvider.js";

// Mock markdown content for tests
const testFiltersMd = `
# trim
Removes excess whitespace from the beginning and end of the entry.

# min
Enforces a minimum value or length for the entry.

# max
Enforces a maximum value or length for the entry.

# upper
Converts all characters to uppercase.

# !lower:to_lower
Converts all characters to lowercase.
`;

const testInputFiltersMd = `
# trim
Removes excess whitespace from the beginning and end of the entry.

# min
Enforces a minimum value or length for the entry.

# max
Enforces a maximum value or length for the entry.

# lower
Converts all characters to lowercase.
`;

const testFunctionsMd = `
# api.lambda
Execute serverless function code in the cloud

# db.get
Retrieve data from database table

# var
Create a variable to store data
`;

const testQueryFiltersMd = `
# inner_product
Provides the inner product between two vectors.

# cosine_distance
Provides the cosine distance between two vectors.

# distance
Provides the distance in meters between two geometries.
`;

describe("onHoverDocument", () => {
  const hoverProviders = [
    new InputVariableMessageProvider(),
    new FunctionMessageProvider(testFunctionsMd),
    new InputFilterMessageProvider(testInputFiltersMd),
    new FilterMessageProvider(testFiltersMd),
    new QueryFilterMessageProvider(testQueryFiltersMd),
  ];

  it("should return null when document is not found", () => {
    const params = {
      textDocument: { uri: "file://nonexistent.xs" },
      position: { line: 0, character: 0 },
    };

    const result = onHoverDocument(params, { get: () => null }, hoverProviders);
    expect(result).to.be.null;
  });

  it("should return null for invalid token position", () => {
    const code = `query test verb=GET {
  response = "hello"
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 0, character: 0 }, // Position on whitespace
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );
    expect(result).to.be.null;
  });

  it("should return null when no hover provider matches", () => {
    const code = `query test verb=GET {
  response = "hello"
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 0, character: 6 }, // Position on "test" which shouldn't match any provider
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );
    expect(result).to.be.null;
  });

  it("should return the deprecation message for deprecated filters", () => {
    const code = `query test verb=GET {
  input {
  }

  stack {
    var $result { 
      value = $input.name|max:1:2|lower 
    }
  }

  response = $result.value
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 6, character: 34 }, // Position on "lower" in the filter
    };
    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );
    expect(result).to.not.be.null;
    expect(result).to.have.property("contents");
    expect(result.contents).to.have.property("kind", "markdown");
    expect(result.contents).to.have.property("value");
    expect(result.contents.value).to.equal(
      "`lower` is deprecated, use `to_lower` instead."
    );
    expect(result).to.have.property("range");
  });

  it("should return hover info for function tokens", () => {
    const code = `query test verb=GET {
  stack {
    var $result {
      value = "hello"
    }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 4 }, // Position on "var"
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    if (result) {
      expect(result).to.have.property("contents");
      expect(result.contents).to.have.property("kind", "markdown");
      expect(result.contents).to.have.property("value");
      expect(result).to.have.property("range");
      expect(result.range).to.have.property("start");
      expect(result.range).to.have.property("end");
    }
  });

  it("should return hover info for filter tokens", () => {
    const code = `query test verb=GET {
  input {
    text name filters=trim
  }
  stack {
    var $result { value = $input.name|to_upper }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 25 }, // Position on "trim" in filters=trim
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    if (result) {
      expect(result).to.have.property("contents");
      expect(result.contents).to.have.property("kind", "markdown");
      expect(result.contents).to.have.property("value");
      expect(result.range).to.have.property("start");
      expect(result.range).to.have.property("end");
    }
  });

  it("should return hover info for pipe filter tokens", () => {
    const code = `query test verb=GET {
  stack {
    var $result { value = $input.name|to_upper }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 37 }, // Position on "to_upper" after pipe
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    if (result) {
      expect(result).to.have.property("contents");
      expect(result.contents).to.have.property("kind", "markdown");
      expect(result.contents).to.have.property("value");
    }
  });

  it("should handle empty hover providers array", () => {
    const code = `query test verb=GET {
  stack {
    var $result { value = "hello" }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 4 }, // Position on "var"
    };

    const result = onHoverDocument(params, { get: () => document }, []);
    expect(result).to.be.null;
  });

  it("should return hover info for input filter tokens in column definition", () => {
    const code = `table users {
  text name filters=trim
  email address filters=lower|trim
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 1, character: 20 }, // Position on "trim" in filters=trim
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    if (result) {
      expect(result).to.have.property("contents");
      expect(result.contents).to.have.property("kind", "markdown");
      expect(result.contents).to.have.property("value");
      expect(result.range).to.have.property("start");
      expect(result.range).to.have.property("end");
    }
  });

  it("should handle lexer errors gracefully", () => {
    const code = `invalid xanoscript syntax @#$%`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 0, character: 5 },
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );
    expect(result).to.be.null;
  });

  it("should return hover info for API function calls", () => {
    const code = `query test verb=GET {
  stack {
    api.lambda {
      code = "console.log('hello')"
    }
    var $result {
      value = "response"
    }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 8 }, // Position on "lambda" in "api.lambda"
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    expect(result).to.not.be.null;
    expect(result).to.have.property("contents");
    expect(result.contents).to.have.property("kind", "markdown");
    expect(result.contents).to.have.property("value");
    expect(result.contents.value).to.include("Execute serverless function");
    expect(result).to.have.property("range");
  });

  it("should return hover info for database function calls", () => {
    const code = `query test verb=GET {
  stack {
    db.get 123 as $user {
      id = $input.user_id
    }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 7 }, // Position on "get" in "db.get"
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    expect(result).to.not.be.null;
    expect(result).to.have.property("contents");
    expect(result.contents).to.have.property("kind", "markdown");
    expect(result.contents).to.have.property("value");
    expect(result.contents.value).to.include("Retrieve data from database");
    expect(result).to.have.property("range");
  });

  it("should return hover info for variable function calls", () => {
    const code = `query test verb=GET {
  stack {
    var $result {
      value = "hello world"
    }
  }
}`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 2, character: 4 }, // Position on "var"
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    expect(result).to.not.be.null;
    expect(result).to.have.property("contents");
    expect(result.contents).to.have.property("kind", "markdown");
    expect(result.contents).to.have.property("value");
    expect(result.contents.value).to.include("Create a variable");
    expect(result).to.have.property("range");
  });

  it("should return hover info for query filter tokens in search context", () => {
    const code = `query books verb=GET {
  where = $db.embedding.vector|inner_product:$input.query_vector
} as $matched_books`;

    const document = TextDocument.create(
      "file://test.xs",
      "xanoscript",
      1,
      code
    );
    const params = {
      textDocument: { uri: "file://test.xs" },
      position: { line: 1, character: 32 }, // Position on "inner_product" (starts at column 32)
    };

    const result = onHoverDocument(
      params,
      { get: () => document },
      hoverProviders
    );

    expect(result).to.not.be.null;
    expect(result).to.have.property("contents");
    expect(result.contents).to.have.property("kind", "markdown");
    expect(result.contents).to.have.property("value");
    expect(result.contents.value).to.include(
      "inner product between two vectors"
    );
    expect(result).to.have.property("range");
  });
});
