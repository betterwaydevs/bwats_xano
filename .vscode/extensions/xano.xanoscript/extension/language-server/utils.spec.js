import { expect } from "chai";
import { describe, it } from "mocha";
import { getSchemeFromContent, Iterator } from "./utils.js";

describe("getSchemeFromContent", () => {
  describe("basic keyword detection", () => {
    it("should return 'addon' for addon content", () => {
      const content = "addon my_addon {}";
      expect(getSchemeFromContent(content)).to.equal("addon");
    });

    it("should return 'agent' for agent content", () => {
      const content = "agent my_agent {}";
      expect(getSchemeFromContent(content)).to.equal("agent");
    });

    it("should return 'agent_trigger' for agent_trigger content", () => {
      const content = "agent_trigger my_trigger {}";
      expect(getSchemeFromContent(content)).to.equal("agent_trigger");
    });

    it("should return 'api_group' for api_group content", () => {
      const content = "api_group auth {}";
      expect(getSchemeFromContent(content)).to.equal("api_group");
    });

    it("should return 'branch' for branch content", () => {
      const content = "branch my_branch {}";
      expect(getSchemeFromContent(content)).to.equal("branch");
    });

    it("should return 'cfn' for function content", () => {
      const content = "function calculate {}";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });

    it("should return 'mcp_server' for mcp_server content", () => {
      const content = "mcp_server my_server {}";
      expect(getSchemeFromContent(content)).to.equal("mcp_server");
    });

    it("should return 'mcp_server_trigger' for mcp_server_trigger content", () => {
      const content = "mcp_server_trigger my_trigger {}";
      expect(getSchemeFromContent(content)).to.equal("mcp_server_trigger");
    });

    it("should return 'middleware' for middleware content", () => {
      const content = "middleware auth_check {}";
      expect(getSchemeFromContent(content)).to.equal("middleware");
    });

    it("should return 'api' for query content", () => {
      const content = "query get_users verb=GET {}";
      expect(getSchemeFromContent(content)).to.equal("api");
    });

    it("should return 'realtime_trigger' for realtime_trigger content", () => {
      const content = "realtime_trigger my_trigger {}";
      expect(getSchemeFromContent(content)).to.equal("realtime_trigger");
    });

    it("should return 'db' for table content", () => {
      const content = "table users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should return 'table_trigger' for table_trigger content", () => {
      const content = "table_trigger my_trigger {}";
      expect(getSchemeFromContent(content)).to.equal("table_trigger");
    });

    it("should return 'task' for task content", () => {
      const content = "task cleanup {}";
      expect(getSchemeFromContent(content)).to.equal("task");
    });

    it("should return 'tool' for tool content", () => {
      const content = "tool my_tool {}";
      expect(getSchemeFromContent(content)).to.equal("tool");
    });

    it("should return 'workflow_test' for workflow_test content", () => {
      const content = "workflow_test my_test {}";
      expect(getSchemeFromContent(content)).to.equal("workflow_test");
    });

    it("should return 'workspace' for workspace content", () => {
      const content = "workspace my_workspace {}";
      expect(getSchemeFromContent(content)).to.equal("workspace");
    });

    it("should return 'workspace_trigger' for workspace_trigger content", () => {
      const content = "workspace_trigger my_trigger {}";
      expect(getSchemeFromContent(content)).to.equal("workspace_trigger");
    });
  });

  describe("whitespace handling", () => {
    it("should handle leading spaces", () => {
      const content = "   table users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle leading tabs", () => {
      const content = "\t\ttable users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle leading newlines", () => {
      const content = "\n\n\ntable users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle mixed leading whitespace", () => {
      const content = "\n  \t\n\t  function calculate {}";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });
  });

  describe("comment handling", () => {
    it("should skip single line comment before keyword", () => {
      const content = "// This is a table\ntable users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should skip multiple line comments before keyword", () => {
      const content =
        "// Comment 1\n// Comment 2\n// Comment 3\ntable users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle comments with whitespace", () => {
      const content = "  // Comment\n  table users {}";
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle mixed comments and whitespace", () => {
      const content =
        "\n// Comment 1\n\n// Comment 2\n  \nfunction calculate {}";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });
  });

  describe("default behavior", () => {
    it("should return 'cfn' for unknown keyword", () => {
      const content = "unknown_keyword something {}";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });

    it("should return 'cfn' for empty content", () => {
      const content = "";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });

    it("should return 'cfn' for whitespace-only content", () => {
      const content = "   \n\t\n   ";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });

    it("should return 'cfn' for comments-only content", () => {
      const content = "// Just a comment\n// Another comment";
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });
  });

  describe("real-world examples", () => {
    it("should handle complete table definition", () => {
      const content = `table users {
  schema {
    int id
    text name?
    email email_address?
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle complete function definition", () => {
      const content = `function calculate {
  input {
    int value1?
    int value2?
  }
  stack {
  }
  response {
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("cfn");
    });

    it("should handle query with verb and parameters", () => {
      const content = `query get_user verb=GET path=/user/{id} {
  input {
    int id
  }
  stack {
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("api");
    });

    it("should handle content with header comment", () => {
      const content = `// Auto-generated by Xano
// Do not modify manually

table products {
  schema {
    int id
    text name
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("db");
    });

    it("should handle task definition", () => {
      const content = `task cleanup interval=daily {
  stack {
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("task");
    });

    it("should handle tool definition", () => {
      const content = `tool my_custom_tool {
  input {
    text query?
  }
  stack {
  }
}`;
      expect(getSchemeFromContent(content)).to.equal("tool");
    });

    it("should handle api_group definition", () => {
      const content = `api_group authentication {
  auth = false
  middleware = []
}`;
      expect(getSchemeFromContent(content)).to.equal("api_group");
    });
  });
});

describe("Iterator", () => {
  describe("basic functionality", () => {
    it("should iterate through items", () => {
      const iter = new Iterator([1, 2, 3]);
      expect(iter.next()).to.equal(1);
      expect(iter.next()).to.equal(2);
      expect(iter.next()).to.equal(3);
    });

    it("should check if has next", () => {
      const iter = new Iterator([1, 2]);
      expect(iter.hasNext()).to.be.true;
      iter.next();
      expect(iter.hasNext()).to.be.true;
      iter.next();
      expect(iter.hasNext()).to.be.false;
    });

    it("should reset iterator", () => {
      const iter = new Iterator([1, 2, 3]);
      iter.next();
      iter.next();
      iter.reset();
      expect(iter.next()).to.equal(1);
    });

    it("should handle empty array", () => {
      const iter = new Iterator([]);
      expect(iter.hasNext()).to.be.false;
      expect(iter.next()).to.be.undefined;
    });
  });
});
