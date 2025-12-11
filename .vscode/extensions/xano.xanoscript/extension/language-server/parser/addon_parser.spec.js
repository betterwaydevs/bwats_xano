import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("addon_parser", () => {
  it("should parse a basic addon", () => {
    const parser = xanoscriptParser(`addon foo {
      input {
      }

      stack {
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a string addon url", () => {
    const parser = xanoscriptParser(`addon "foo/bar" {
      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should accept an input and a db.query statement", () => {
    const parser = xanoscriptParser(`addon tweet_liked_by_user {
      input {
        // ID of the tweet to check
        int tweet_id? {
          table = "tweet"
        }
      
        // ID of the user to check
        int user_id? {
          table = "user"
        }
      }
    
      stack {
        db.query like {
          where = $db.like.tweet_id == $input.tweet_id && $db.like.user_id == $input.user_id
          return = {type: "exists"}
        }
      }
    }`);

    expect(parser.warnings).to.be.empty;
    expect(parser.errors).to.be.empty;
  });

  it("should not accept an input that is not a db.query", () => {
    const parser = xanoscriptParser(`addon post_author {
      input {
        int user_id {
          table = "user"
          description = "The ID of the user/author"
        }
      }
    
      stack {
        db.get user {
          field_name = "id"
          field_value = $input.user_id
          output = ["id", "name", "avatar_url"]
        } as $author
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("addon don't accept dynamic params", () => {
    const parser = xanoscriptParser(`addon foo/{user_id} {
      input {
        text user_id filters=trim
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });
});
