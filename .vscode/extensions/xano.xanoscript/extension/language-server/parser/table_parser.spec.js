import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("table_parser", () => {
  it("should parse a basic table with identifier name", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false

        schema {
          int id
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic table with a view", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false

        schema {
          // Primary key
          int id
        }

        view = {
          "adults": {
            search: $db.age > 21
            sort  : {age: "asc"}
            id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
          }
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  // autocomplete = [{ name: "id" }, { name: "cd" }];
  it("should parse a table with an autocomplete field", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false

        schema {
          int id
          text cd
        }

        autocomplete = [{ name: "id" }, { name: "cd" }]
      }`);
    expect(parser.errors).to.be.empty;
  });

  // autocomplete = [{ name: "id" }, { name: "cd" }];
  it("should requires a new line between statements", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false 
        
        schema {
          int id
          text cd
        } autocomplete = [{ name: "id" }, { name: "cd" }]
      }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should reject a table without an id column", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false

        schema {
          text name
        }
      }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should reject a non int or uuid id column", () => {
    const parser = xanoscriptParser(`table foo {
        auth = false

        schema {
          text id
        }
      }`);
    expect(parser.errors).to.not.be.empty;
  });
});

describe("multiDoc table parser", () => {
  it("accepts items elements", () => {
    const parser =
      xanoscriptParser(`// User-Role junction table - assigns roles to users
      table user_role {
        auth = false
      
        schema {
          int id
          
          int user_id {
            table = "user"
            description = "Reference to the user"
          }
          
          int role_id {
            table = "role"
            description = "Reference to the role"
          }
          
          // Who assigned this role
          int assigned_by? {
            table = "user"
            description = "User who assigned this role"
          }
          
          timestamp created_at?=now
        }
      
        index = [
          {type: "primary", field: [{name: "id"}]}
          {type: "btree|unique", field: [{name: "user_id", op: "asc"}, {name: "role_id", op: "asc"}]}
          {type: "btree", field: [{name: "role_id", op: "asc"}]}
        ]
      
        // Seed user-role assignments
        items = [
          {"id": 1, "user_id": 1, "role_id": 1, "assigned_by": null, "created_at": 1733788800000}
          {"id": 2, "user_id": 2, "role_id": 2, "assigned_by": 1, "created_at": 1733788800000}
          {"id": 3, "user_id": 3, "role_id": 4, "assigned_by": 1, "created_at": 1733788800000}
        ]
      }
      `);
    expect(parser.errors).to.be.empty;
  });
});
