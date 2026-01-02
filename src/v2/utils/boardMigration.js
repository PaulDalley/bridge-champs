/**
 * Board Migration Utilities
 * Convert old MakeBoard tag format to new structured format
 */

import { stringToHand, handToString } from '../types/board.types.js';

/**
 * Parse MakeBoard tag string to structured board object
 * @param {string} makeBoardTag - e.g., '<MakeBoard boardType="single" position="North" North="AKQ JT9 876 5432" ... />'
 * @returns {BridgeBoard|null}
 */
export const parseMakeBoardTag = (makeBoardTag) => {
  if (!makeBoardTag || typeof makeBoardTag !== 'string') {
    return null;
  }

  try {
    // Extract attributes using regex
    const attrRegex = /(\w+)="([^"]*)"/g;
    const attributes = {};
    let match;

    while ((match = attrRegex.exec(makeBoardTag)) !== null) {
      const [, key, value] = match;
      attributes[key] = value;
    }

    // Build structured board object
    const board = {
      id: `migrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      boardType: attributes.boardType || 'full',
      position: attributes.position || 'full',
      vulnerability: attributes.vuln || 'none',
      dealer: attributes.dealer || 'North',
      bidding: attributes.bidding ? attributes.bidding.split('/').filter((b) => b.trim()) : [],
      north: stringToHand(attributes.North || ''),
      south: stringToHand(attributes.South || ''),
      east: stringToHand(attributes.East || ''),
      west: stringToHand(attributes.West || ''),
    };

    return board;
  } catch (error) {
    console.error('Error parsing MakeBoard tag:', error);
    return null;
  }
};

/**
 * Convert structured board object back to MakeBoard tag (for backward compatibility)
 * @param {BridgeBoard} board
 * @returns {string}
 */
export const boardToMakeBoardTag = (board) => {
  const northStr = handToString(board.north);
  const southStr = handToString(board.south);
  const eastStr = handToString(board.east);
  const westStr = handToString(board.west);
  const biddingStr = board.bidding.join('/');

  return `<MakeBoard boardType="${board.boardType}" position="${board.position}" North="${northStr}" South="${southStr}" East="${eastStr}" West="${westStr}" vuln="${board.vulnerability}" dealer="${board.dealer}" bidding="${biddingStr}" />`;
};

/**
 * Extract all MakeBoard tags from article text
 * @param {string} articleText
 * @returns {Array<{tag: string, index: number}>}
 */
export const extractMakeBoardTags = (articleText) => {
  if (!articleText) return [];

  const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
  const tags = [];
  let match;

  while ((match = makeBoardRegex.exec(articleText)) !== null) {
    tags.push({
      tag: match[0],
      index: match.index,
    });
  }

  return tags;
};

/**
 * Migrate article text: convert MakeBoard tags to structured format
 * Returns both the migrated structured boards and the original text (for backward compatibility)
 * @param {string} articleText
 * @returns {{boards: BridgeBoard[], originalText: string}}
 */
export const migrateArticleBoards = (articleText) => {
  const tags = extractMakeBoardTags(articleText);
  const boards = tags
    .map(({ tag }) => parseMakeBoardTag(tag))
    .filter((board) => board !== null);

  return {
    boards,
    originalText: articleText, // Keep original for backward compatibility
  };
};


