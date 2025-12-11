#!/usr/bin/env node

import process from "node:process";
import { lexDocument } from "./lexer/lexer.js";
import { XanoScriptParser } from "./parser/parser.js";

// Placeholder - replace with your XanoScript code to profile
const SAMPLE_CODE = `query auth/me verb=GET {
  description = "Get the user record belonging to the authentication token"
  auth = "user"
  input {
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
      output = ["id", "created_at", "name", "email"]
    } as $user
  }

  response = $user

  history = "inherit"
}`;

function profileParsing(code, iterations = 100) {
  console.log(`Profiling parser with ${iterations} iterations...`);
  console.log(`Code length: ${code.length} characters`);
  console.log("---");

  // Lexing performance
  console.time("Lexing (total)");
  let lexResults = [];
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    const lexResult = lexDocument(code);
    const end = process.hrtime.bigint();

    lexResults.push({
      duration: Number(end - start) / 1000000, // Convert to milliseconds
      tokens: lexResult.tokens.length,
      errors: lexResult.errors.length,
    });
  }
  console.timeEnd("Lexing (total)");

  // Parsing performance (assuming query parser for this example)
  console.time("Parsing (total)");
  let parseResults = [];
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();

    const lexResult = lexDocument(code);
    const parser = new XanoScriptParser();
    parser.input = lexResult.tokens;

    try {
      parser.queryDeclaration();
      const parseErrors = parser.errors;
      const end = process.hrtime.bigint();

      parseResults.push({
        duration: Number(end - start) / 1000000, // Convert to milliseconds
        errors: parseErrors.length,
        success: parseErrors.length === 0,
      });
    } catch (error) {
      const end = process.hrtime.bigint();
      parseResults.push({
        duration: Number(end - start) / 1000000,
        errors: 1,
        success: false,
        error: error.message,
      });
    }
  }
  console.timeEnd("Parsing (total)");

  // Calculate statistics
  const lexStats = calculateStats(lexResults.map((r) => r.duration));
  const parseStats = calculateStats(parseResults.map((r) => r.duration));

  console.log("\n=== LEXING RESULTS ===");
  console.log(`Average tokens: ${Math.round(lexResults[0].tokens)}`);
  console.log(`Lex errors: ${lexResults[0].errors}`);
  console.log(`Average time: ${lexStats.avg.toFixed(2)}ms`);
  console.log(`Min time: ${lexStats.min.toFixed(2)}ms`);
  console.log(`Max time: ${lexStats.max.toFixed(2)}ms`);
  console.log(`Median time: ${lexStats.median.toFixed(2)}ms`);

  console.log("\n=== PARSING RESULTS ===");
  console.log(
    `Success rate: ${(
      (parseResults.filter((r) => r.success).length / parseResults.length) *
      100
    ).toFixed(1)}%`
  );
  console.log(`Average time: ${parseStats.avg.toFixed(2)}ms`);
  console.log(`Min time: ${parseStats.min.toFixed(2)}ms`);
  console.log(`Max time: ${parseStats.max.toFixed(2)}ms`);
  console.log(`Median time: ${parseStats.median.toFixed(2)}ms`);

  if (parseResults.some((r) => r.error)) {
    console.log("\n=== PARSE ERRORS ===");
    const uniqueErrors = [
      ...new Set(parseResults.filter((r) => r.error).map((r) => r.error)),
    ];
    uniqueErrors.forEach((error) => console.log(`- ${error}`));
  }

  console.log("\n=== PERFORMANCE SUMMARY ===");
  console.log(
    `Total time per parse: ${(lexStats.avg + parseStats.avg).toFixed(2)}ms`
  );
  console.log(
    `Lexing: ${((lexStats.avg / (lexStats.avg + parseStats.avg)) * 100).toFixed(
      1
    )}%`
  );
  console.log(
    `Parsing: ${(
      (parseStats.avg / (lexStats.avg + parseStats.avg)) *
      100
    ).toFixed(1)}%`
  );
}

function calculateStats(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  return {
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    median: sorted[Math.floor(sorted.length / 2)],
  };
}

function profileMemory(code, iterations = 10) {
  console.log("\n=== MEMORY PROFILING ===");

  // Force garbage collection if available
  if (globalThis.gc) {
    globalThis.gc();
  }

  const initialMemory = process.memoryUsage();
  console.log(
    `Initial memory: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`
  );

  // Create multiple parser instances to see memory growth
  const parsers = [];
  for (let i = 0; i < iterations; i++) {
    const lexResult = lexDocument(code);
    const parser = new XanoScriptParser();
    parser.input = lexResult.tokens;

    try {
      parser.query();
    } catch {
      // Ignore parse errors for memory testing
    }

    parsers.push(parser);
  }

  const peakMemory = process.memoryUsage();
  console.log(
    `Peak memory: ${(peakMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `Memory increase: ${(
      (peakMemory.heapUsed - initialMemory.heapUsed) /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
  console.log(
    `Memory per parser: ${(
      (peakMemory.heapUsed - initialMemory.heapUsed) /
      iterations /
      1024
    ).toFixed(2)}KB`
  );
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const iterations = args.length > 0 ? parseInt(args[0]) : 100;

  console.log("XanoScript Parser Profiler");
  console.log("===========================");

  // Replace SAMPLE_CODE with your actual code to profile
  profileParsing(SAMPLE_CODE, iterations);
  profileMemory(SAMPLE_CODE, Math.min(iterations, 50));

  console.log("\n=== USAGE ===");
  console.log(
    "To profile with different iterations: node profile-parser.js [iterations]"
  );
  console.log(
    "To enable GC for memory profiling: node --expose-gc profile-parser.js"
  );
  console.log("To profile with CPU profiler: node --prof profile-parser.js");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { profileParsing, profileMemory };
