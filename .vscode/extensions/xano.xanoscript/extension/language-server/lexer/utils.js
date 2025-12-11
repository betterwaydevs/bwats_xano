import { createToken } from "chevrotain";

const tokenRegistry = new Map();

/**
 * A factory function to create a token with a unique pattern
 *
 * @param {import('chevrotain').ITokenConfig} config The configuration object for the token
 * @returns {import('chevrotain').TokenType}
 */
export function createUniqToken(config) {
  const { pattern } = config;
  const patternKey = pattern.toString(); // Convert RegExp to string for Map key
  if (tokenRegistry.has(patternKey)) {
    return tokenRegistry.get(patternKey);
  }
  const token = createToken(config);
  tokenRegistry.set(patternKey, token);
  return token;
}

/**
 * A shorthand function to create a token with a name derived from the given name
 *
 * @param {string} name The name of the token will be used to generate its pattern
 * @param {import('chevrotain').ITokenConfig} config The configuration object for the token
 * @returns {import('chevrotain').TokenType}
 */
export function createTokenByName(name, config) {
  return createUniqToken({
    name: `${name} token`,
    pattern: new RegExp(name),
    label: name,
    ...config,
  });
}

export function __resetTokens() {
  tokenRegistry.clear();
}

export function sortUniqTokens(tokens) {
  // make tokens unique
  tokens = Array.from(new Set(tokens));

  // sort by pattern length
  return tokens.sort((a, b) => {
    if (a.PATTERN.source.length > b.PATTERN.source.length) {
      return -1;
    }
    if (a.PATTERN.source.length < b.PATTERN.source.length) {
      return 1;
    }
    return 0;
  });
}
