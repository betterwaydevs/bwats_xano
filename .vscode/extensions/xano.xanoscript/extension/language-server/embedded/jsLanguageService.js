/**
 * JavaScript Language Service Integration
 * Coordinates JavaScript language features for embedded code
 */

import { extractEmbeddedJS, mapToVirtualJS } from './embeddedContent.js';
import { embeddedDocuments } from './embeddedDocuments.js';

export class JSLanguageService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the service
   */
  initialize() {
    this.initialized = true;
  }

  /**
   * Check if a position is in an embedded JavaScript region
   * @param {object} document - The text document
   * @param {object} position - The position to check
   * @returns {boolean}
   */
  isInEmbeddedRegion(document, position) {
    const text = document.getText();
    const offset = document.offsetAt(position);
    return mapToVirtualJS(offset, text) !== null;
  }

  /**
   * Update virtual document for a changed XanoScript file
   * @param {object} document - The text document
   */
  updateVirtualDocument(document) {
    const text = document.getText();
    const regions = extractEmbeddedJS(text);
    embeddedDocuments.update(document.uri, regions);
  }

  /**
   * Remove virtual document when XanoScript file is closed
   * @param {string} uri - Document URI
   */
  removeVirtualDocument(uri) {
    embeddedDocuments.remove(uri);
  }

  /**
   * Get the JavaScript content for a position
   * @param {object} document - The text document
   * @param {object} position - The position
   * @returns {{content: string, jsOffset: number} | null}
   */
  getJSContent(document, position) {
    const text = document.getText();
    const offset = document.offsetAt(position);
    const result = mapToVirtualJS(offset, text);
    
    if (!result) {
      return null;
    }

    return {
      content: result.region.content,
      jsOffset: result.jsOffset
    };
  }
}

// Export singleton instance
export const jsLanguageService = new JSLanguageService();
