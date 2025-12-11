import { expect } from "chai";
import { tokenMatcher } from "chevrotain";
import { readFileSync } from "fs";
import { describe, it } from "mocha";
import { Iterator } from "../../../utils.js";
import { IntToken, TimestampToken } from "../../columns.js";
import {
  ColonToken,
  CommaToken,
  EqualToken,
  LCurly,
  LSquare,
  Question,
  RCurly,
  RSquare,
} from "../../control.js";
import { SchemaToken } from "../../db.js";
import { lexDocument } from "../../lexer.js";
import { StringLiteral } from "../../literal.js";
import { SecurityToken } from "../../security.js";
import { TableToken } from "../../table.js";
import {
  AuthToken,
  FalseToken,
  FieldToken,
  GuidToken,
  Identifier,
  IndexToken,
  NewlineToken,
  NowToken,
  TrueToken,
  TypeToken,
} from "../../tokens.js";

describe("Xanoscript Table Lexer", () => {
  it("Can Lex an empty table", () => {
    const empty_table = readFileSync(
      "lexer/tests/table/empty_table.xs",
      "utf8"
    );
    const lexingResult = lexDocument(empty_table);

    expect(lexingResult.errors).to.be.empty;

    const tokens = new Iterator(lexingResult.tokens);
    expect(tokens.next().image).to.equal("table");
    expect(tokens.next().image).to.equal("empty");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("\n");
    expect(tokens.next().image).to.equal("auth");
    expect(tokens.next().image).to.equal("=");
    expect(tokens.next().image).to.equal("false");
    expect(tokens.next().image).to.equal("\n");
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next()).to.be.undefined;

    tokens.reset();
    // tokenMatcher acts as an "instanceof" check for Tokens
    expect(tokenMatcher(tokens.next(), TableToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), AuthToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), EqualToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), FalseToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
  });

  it("Can Lex a basic table", () => {
    const basic_table = readFileSync(
      "lexer/tests/table/basic_table.xs",
      "utf8"
    );
    const lexingResult = lexDocument(basic_table);

    expect(lexingResult.errors).to.be.empty;

    const tokens = new Iterator(lexingResult.tokens);
    expect(tokens.next().image).to.equal("table");
    expect(tokens.next().image).to.equal("empty");
    expect(tokens.next().image).to.equal("{");

    // auth = true
    expect(tokens.next().image).to.equal("\n");
    expect(tokens.next().image).to.equal("auth");
    expect(tokens.next().image).to.equal("=");
    expect(tokens.next().image).to.equal("true");
    expect(tokens.next().image).to.equal("\n");

    // entering security section
    expect(tokens.next().image).to.equal("security");
    expect(tokens.next().image).to.equal("=");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("\n");

    // guid = "-iOFONN4cySSKJ0MTrPNojIWB5c"
    expect(tokens.next().image).to.equal("guid");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"-iOFONN4cySSKJ0MTrPNojIWB5c"');
    expect(tokens.next().image).to.equal("\n");

    // leaving security section
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("\n");
    expect(tokens.next().image).to.equal("\n");

    // entering schema section
    expect(tokens.next().image).to.equal("schema");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("\n");

    // int id
    expect(tokens.next().image).to.equal("int");
    expect(tokens.next().image).to.equal("id");
    expect(tokens.next().image).to.equal("\n");

    // timestamp created_at?=now
    expect(tokens.next().image).to.equal("timestamp");
    expect(tokens.next().image).to.equal("created_at");
    expect(tokens.next().image).to.equal("?");
    expect(tokens.next().image).to.equal("=");
    expect(tokens.next().image).to.equal("now");
    expect(tokens.next().image).to.equal("\n");

    // leaving schema section
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("\n");
    expect(tokens.next().image).to.equal("\n");

    // entering index section
    expect(tokens.next().image).to.equal("index");
    expect(tokens.next().image).to.equal("=");
    expect(tokens.next().image).to.equal("[");
    expect(tokens.next().image).to.equal("\n");

    // {type: "primary", field: [{name: "id"}]}
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("type");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"primary"');
    expect(tokens.next().image).to.equal(",");
    expect(tokens.next().image).to.equal("field");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal("[");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("name");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"id"');
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("]");
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("\n");

    // {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("type");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"gin"');
    expect(tokens.next().image).to.equal(",");
    expect(tokens.next().image).to.equal("field");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal("[");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("name");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"xdo"');
    expect(tokens.next().image).to.equal(",");
    expect(tokens.next().image).to.equal("op");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"jsonb_path_op"');
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("]");
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("\n");

    // {type: "btree", field: [{name: "created_at", op: "desc"}]}
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("type");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"btree"');
    expect(tokens.next().image).to.equal(",");
    expect(tokens.next().image).to.equal("field");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal("[");
    expect(tokens.next().image).to.equal("{");
    expect(tokens.next().image).to.equal("name");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"created_at"');
    expect(tokens.next().image).to.equal(",");
    expect(tokens.next().image).to.equal("op");
    expect(tokens.next().image).to.equal(":");
    expect(tokens.next().image).to.equal('"desc"');
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("]");
    expect(tokens.next().image).to.equal("}");
    expect(tokens.next().image).to.equal("\n");

    // leaving index section
    expect(tokens.next().image).to.equal("]");
    expect(tokens.next().image).to.equal("\n");

    // leaving table
    expect(tokens.next().image).to.equal("}");

    tokens.reset();
    // // tokenMatcher acts as an "instanceof" check for Tokens
    expect(tokenMatcher(tokens.next(), TableToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), AuthToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), EqualToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), TrueToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // security {
    //   guid = "-iOFONN4cySSKJ0MTrPNojIWB5c"
    // }
    expect(tokenMatcher(tokens.next(), SecurityToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), EqualToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), GuidToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // schema {
    //   int id
    //   timestamp created_at?=now
    // }
    expect(tokenMatcher(tokens.next(), SchemaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), IntToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), TimestampToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), Question)).to.be.true;
    expect(tokenMatcher(tokens.next(), EqualToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NowToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // index = [{...}, {...}, {...}]
    expect(tokenMatcher(tokens.next(), IndexToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), EqualToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // {type: "primary", field: [{name: "id"}]}
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), TypeToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), CommaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), FieldToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), RSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), TypeToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), CommaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), FieldToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), CommaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), RSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    // {type: "btree", field: [{name: "created_at", op: "desc"}]}
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), TypeToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), CommaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), FieldToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), LSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), LCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), CommaToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), Identifier)).to.be.true;
    expect(tokenMatcher(tokens.next(), ColonToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), StringLiteral)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), RSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;

    expect(tokenMatcher(tokens.next(), RSquare)).to.be.true;
    expect(tokenMatcher(tokens.next(), NewlineToken)).to.be.true;
    expect(tokenMatcher(tokens.next(), RCurly)).to.be.true;
  });
});
