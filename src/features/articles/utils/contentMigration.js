/**
 * Content Migration Utilities
 * 
 * Converts between old HTML format and new block-based format
 * Preserves all existing data
 */

import { convertOldMakeBoardTag, convertToOldFormat } from '../../bridge-board/utils/migration';

/**
 * Extracts MakeBoard tags from HTML and converts to JSON blocks
 * @param {string} html
 * @returns {Array<{type: string, data: any}>}
 */
export const extractMakeBoardBlocks = (html) => {
  const blocks = [];
  const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
  let match;
  let lastIndex = 0;

  while ((match = makeBoardRegex.exec(html)) !== null) {
    // Add text before MakeBoard
    const textBefore = html.substring(lastIndex, match.index).trim();
    if (textBefore) {
      blocks.push({
        type: 'html',
        content: textBefore,
      });
    }

    // Convert MakeBoard tag to JSON
    const board = convertOldMakeBoardTag(match[0]);
    if (board) {
      blocks.push({
        type: 'makeBoard',
        data: board,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  const remainingText = html.substring(lastIndex).trim();
  if (remainingText) {
    blocks.push({
      type: 'html',
      content: remainingText,
    });
  }

  return blocks;
};

/**
 * Converts TipTap HTML to article content format
 * @param {string} html
 * @returns {Object}
 */
export const convertEditorHTMLToContent = (html) => {
  // Extract MakeBoard blocks
  const makeBoardRegex = /<make-board[^>]*data-board="([^"]*)"[^>]*><\/make-board>/g;
  const blocks = [];
  let match;
  let lastIndex = 0;

  while ((match = makeBoardRegex.exec(html)) !== null) {
    // Add HTML before MakeBoard
    const htmlBefore = html.substring(lastIndex, match.index).trim();
    if (htmlBefore) {
      blocks.push({
        type: 'html',
        content: htmlBefore,
      });
    }

    // Parse MakeBoard data
    try {
      const boardData = JSON.parse(decodeURIComponent(match[1]));
      blocks.push({
        type: 'makeBoard',
        data: boardData,
      });
    } catch (e) {
      console.error('Error parsing MakeBoard data:', e);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining HTML
  const remainingHtml = html.substring(lastIndex).trim();
  if (remainingHtml) {
    blocks.push({
      type: 'html',
      content: remainingHtml,
    });
  }

  return {
    blocks,
    version: 2, // New format version
  };
};

/**
 * Converts article content back to HTML (for backward compatibility)
 * @param {Object} content
 * @returns {string}
 */
export const convertContentToHTML = (content) => {
  if (!content) return '';

  // If it's already HTML string (old format)
  if (typeof content === 'string') {
    return content;
  }

  // If it's blocks format
  if (content.blocks && Array.isArray(content.blocks)) {
    let html = '';
    
    content.blocks.forEach(block => {
      if (block.type === 'html') {
        html += block.content;
      } else if (block.type === 'makeBoard' && block.data) {
        // Convert MakeBoard block to old format tag
        html += convertToOldFormat(block.data);
      }
    });
    
    return html;
  }

  return '';
};

/**
 * Converts old HTML content to TipTap-compatible HTML
 * @param {string} html
 * @returns {string}
 */
export const convertOldHTMLToEditorFormat = (html) => {
  if (!html) return '';

  // Replace old MakeBoard tags with new format
  const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
  
  return html.replace(makeBoardRegex, (match) => {
    const board = convertOldMakeBoardTag(match);
    if (board) {
      return `<make-board data-board="${encodeURIComponent(JSON.stringify(board))}"></make-board>`;
    }
    return match;
  });
};

