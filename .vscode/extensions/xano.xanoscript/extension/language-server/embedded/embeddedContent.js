/**
 * Extract embedded JavaScript from XanoScript documents
 * Finds api.lambda { code = """...""" } blocks
 */

/**
 * Extract all embedded JavaScript regions from XanoScript text
 * @param {string} text - The full XanoScript document text
 * @returns {Array<{content: string, offset: number, end: number}>} Array of JS regions
 */
export function extractEmbeddedJS(text) {
  const regions = [];
  
  // Pattern matches: code = """..."""
  // We use a simpler pattern that works regardless of context (api.lambda, etc.)
  const pattern = /code\s*=\s*"""\s*\n([\s\S]*?)\n\s*"""/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const content = match[1]; // The captured JavaScript content
    const offset = match.index + match[0].indexOf(match[1]); // Start of JS content
    const end = offset + content.length;
    
    regions.push({
      content,
      offset,
      end
    });
  }
  
  return regions;
}

/**
 * Check if a cursor position is within an embedded JavaScript region
 * @param {number} offset - Cursor offset in the document
 * @param {string} text - The full XanoScript document text
 * @returns {{region: object, jsOffset: number} | null} The region and offset within JS, or null
 */
export function mapToVirtualJS(offset, text) {
  const regions = extractEmbeddedJS(text);
  
  for (const region of regions) {
    if (offset >= region.offset && offset <= region.end) {
      const jsOffset = offset - region.offset;
      return {
        region,
        jsOffset
      };
    }
  }
  
  return null;
}

/**
 * Map a position from virtual JavaScript document back to XanoScript document
 * @param {number} virtualOffset - Offset in the virtual JS document
 * @param {object} region - The region object from extractEmbeddedJS
 * @returns {number} Offset in the original XanoScript document
 */
export function mapFromVirtualJS(virtualOffset, region) {
  return region.offset + virtualOffset;
}

/**
 * Check if a position is inside an embedded JavaScript region
 * @param {number} offset - Cursor offset in the document
 * @param {string} text - The full XanoScript document text
 * @returns {boolean}
 */
export function isInEmbeddedRegion(offset, text) {
  return mapToVirtualJS(offset, text) !== null;
}
