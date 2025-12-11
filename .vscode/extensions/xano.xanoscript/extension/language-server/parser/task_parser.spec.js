import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("task_parser", () => {
  it("should parse a basic task", () => {
    const parser = xanoscriptParser(`task task_for_listing {
  stack {
  }

  schedule = []
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse an active task", () => {
    const parser = xanoscriptParser(`task task_for_listing {
  active = true
  stack {
  }

  schedule = [
    {starts_on: 2025-08-27 20:13:22+0000, freq: 86400}
  ]

  history = "inherit"
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a task with datasource", () => {
    const parser = xanoscriptParser(`task my_data_task {
  datasource = "primary_database"
  stack {
  }

  schedule = []

}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a task with all optional fields", () => {
    const parser = xanoscriptParser(`task comprehensive_task {
  active = true
  datasource = "analytics_db"
  description = "Comprehensive task example"
  docs = "Full documentation here"

  stack {
  }

  schedule = [
    {starts_on: 2025-08-27 20:13:22+0000, freq: 86400}
  ]

  history = "inherit"

  tags = ["production", "critical"]
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should handle multiple schedules", () => {
    const parser = xanoscriptParser(`task foo {
      active = false
    
      stack {
      }
    
      schedule = [
        {starts_on: 2025-10-14 12:47:59+0000}
        {starts_on: 2025-10-14 12:48:02+0000, freq: 86400}
        {
          starts_on: 2025-10-14 12:48:05+0000
          freq     : 259200
          ends_on  : 2025-10-14 12:48:05+0000
        }
      ]
    }`);
    expect(parser.errors).to.be.empty;
  });
});
