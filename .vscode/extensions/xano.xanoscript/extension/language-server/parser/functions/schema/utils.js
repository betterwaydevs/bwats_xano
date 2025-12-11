/**
 * Check if an argument to a key is an enum (a list with at least 2 values)
 */
export function isEnumAttribute(attr) {
  if (typeof attr !== "object" || !Array.isArray(attr)) return false;
  return attr.length >= 2;
}

/**
 * Check if an argument is an array type (an array with a single value)
 */
export function isArrayAttribute(attr) {
  if (typeof attr !== "object" || !Array.isArray(attr)) return false;
  return attr.length === 1;
}

/**
 * If an attribute ends with a "?" it is optional
 * @param {*} attr
 * @returns
 */
export function isOptionalAttribute(attr) {
  if (!attr || typeof attr !== "string") return false;
  return attr.endsWith("?") || attr.endsWith("*");
}

/**
 * If an attributes ends with a "*" it is multiple
 * @param {*} attr
 * @returns
 */
export function isMultiAttribute(attr) {
  if (!attr || typeof attr !== "string") return false;
  return attr.endsWith("*");
}

/**
 * If an attribute ends with a "?" it is optional
 * @param {*} attr
 * @returns
 */
export function canBeDisabledAttribute(attr) {
  if (!attr || typeof attr !== "string") return false;
  return attr.startsWith("!");
}

/**
 * if an attribute is within `[]` it's an object
 */
export function isSchemaGenericType(attr) {
  if (!attr || typeof attr !== "string") return false;
  if (isOptionalAttribute(attr)) {
    attr = attr.slice(0, -1);
  }
  if (canBeDisabledAttribute(attr)) {
    attr = attr.slice(1);
  }
  return attr.startsWith("[") && attr.endsWith("]");
}

/**
 * takes constant attribute and returns its value
 */
export function getSchemaConstantValue(attr) {
  if (canBeDisabledAttribute(attr)) {
    attr = attr.slice(1);
  }
  if (isOptionalAttribute(attr)) {
    attr = attr.slice(0, -1);
  }
  return attr;
}

/**
 * takes a schema generic type attribute and returns its name
 *
 * [string] => string
 * [number]? => number
 * ![boolean] => boolean
 * [string]* => string
 * @param {*} attr
 * @returns
 */
export function getSchemaGenericTypeName(attr) {
  if (!isSchemaGenericType(attr)) return null;
  if (isOptionalAttribute(attr)) {
    attr = attr.slice(0, -1);
  }
  if (canBeDisabledAttribute(attr)) {
    attr = attr.slice(1);
  }
  return attr.slice(1, -1);
}

/**
 *
 * @param {string} attr
 * @param {string[]} types
 * @returns
 */
export function schemaExpectOneOf(attr, types) {
  if (isSchemaGenericType(attr)) {
    return types.includes(getSchemaGenericTypeName(attr));
  }
  return false;
}

/**
 * check if a value matches the requirements
 * @param {*} value
 * @param {*} requirements
 * @returns {boolean|string} type name if matches, false if not, or the generic type that matches
 */
export const valueMatchRequirements = (value, requirements) => {
  for (const requirement of requirements) {
    // is the key a generic type? (there can be only one then)
    if (isSchemaGenericType(requirement)) {
      switch (getSchemaGenericTypeName(requirement)) {
        case "string":
          if (typeof value === "string") return requirement;
          break;
        case "number":
          if (!isNaN(Number(value))) return requirement;
          break;
        case "boolean":
          if (value === "true" || value === "false") return requirement;
          break;
      }
    } else if (getSchemaConstantValue(requirement) === value) {
      return requirement;
    } else if (value === requirement) {
      return requirement;
    }
  }
  return false;
};
