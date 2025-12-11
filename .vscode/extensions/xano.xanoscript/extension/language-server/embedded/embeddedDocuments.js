/**
 * Manages virtual documents for embedded JavaScript code
 * This is a lightweight manager that tracks virtual document state
 */

export class EmbeddedDocumentManager {
  constructor() {
    // Map of document URI -> array of virtual documents
    this.virtualDocuments = new Map();
  }

  /**
   * Update virtual documents for a given XanoScript document
   * @param {string} uri - The XanoScript document URI
   * @param {Array} regions - Array of embedded JS regions from extractEmbeddedJS
   */
  update(uri, regions) {
    this.virtualDocuments.set(uri, regions);
  }

  /**
   * Get all virtual documents for a given URI
   * @param {string} uri - The XanoScript document URI
   * @returns {Array} Array of regions
   */
  get(uri) {
    return this.virtualDocuments.get(uri) || [];
  }

  /**
   * Remove virtual documents for a URI
   * @param {string} uri - The XanoScript document URI
   */
  remove(uri) {
    this.virtualDocuments.delete(uri);
  }

  /**
   * Clear all virtual documents
   */
  clear() {
    this.virtualDocuments.clear();
  }

  /**
   * Check if a document has any embedded regions
   * @param {string} uri - The XanoScript document URI
   * @returns {boolean}
   */
  has(uri) {
    const regions = this.virtualDocuments.get(uri);
    return regions && regions.length > 0;
  }
}

// Export a singleton instance
export const embeddedDocuments = new EmbeddedDocumentManager();
