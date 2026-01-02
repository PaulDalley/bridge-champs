/**
 * Migration Utilities
 * 
 * Converts old string-based MakeBoard format to new JSON format
 * Preserves all existing data
 */

/**
 * Parses old string format: "*S-AKQ*H-*D-*C-"
 * @param {string} handString
 * @returns {{spades: string, hearts: string, diamonds: string, clubs: string}}
 */
export const parseOldHandString = (handString) => {
  const hand = {
    spades: '',
    hearts: '',
    diamonds: '',
    clubs: '',
  };
  
  if (!handString) return hand;
  
  // Format: "*S-AKQ*H-*D-*C-"
  const parts = handString.split('*').filter(p => p);
  
  parts.forEach(part => {
    if (part.startsWith('S-')) {
      hand.spades = part.substring(2);
    } else if (part.startsWith('H-')) {
      hand.hearts = part.substring(2);
    } else if (part.startsWith('D-')) {
      hand.diamonds = part.substring(2);
    } else if (part.startsWith('C-')) {
      hand.clubs = part.substring(2);
    }
  });
  
  return hand;
};

/**
 * Converts old MakeBoard tag to new JSON format
 * @param {string} makeBoardTag - Old format: <MakeBoard boardType="single" position="North" North="*S-AKQ*H-*D-*C-" ... />
 * @returns {BridgeBoard|null}
 */
export const convertOldMakeBoardTag = (makeBoardTag) => {
  if (!makeBoardTag || !makeBoardTag.includes('MakeBoard')) {
    return null;
  }
  
  try {
    // Extract attributes from tag
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let match;
    
    while ((match = attrRegex.exec(makeBoardTag)) !== null) {
      attrs[match[1]] = match[2];
    }
    
    // Convert to new format
    const board = {
      id: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: attrs.boardType || 'single',
      position: attrs.position || 'North',
      hands: {
        North: parseOldHandString(attrs.North || ''),
        South: parseOldHandString(attrs.South || ''),
        East: parseOldHandString(attrs.East || ''),
        West: parseOldHandString(attrs.West || ''),
      },
      vulnerability: attrs.vuln || 'None',
      dealer: attrs.dealer || 'North',
      bidding: attrs.bidding ? attrs.bidding.split('/').filter(b => b && b !== '_') : [],
    };
    
    return board;
  } catch (error) {
    console.error('Error converting old MakeBoard tag:', error);
    return null;
  }
};

/**
 * Converts new JSON format back to old string format (for backward compatibility)
 * @param {BridgeBoard} board
 * @returns {string}
 */
export const convertToOldFormat = (board) => {
  const formatHand = (hand) => {
    return `*S-${hand.spades}*H-${hand.hearts}*D-${hand.diamonds}*C-${hand.clubs}`;
  };
  
  const bidding = board.bidding.length > 0 ? board.bidding.join('/') : '';
  
  return `<MakeBoard boardType="${board.type}" position="${board.position || ''}" North="${formatHand(board.hands.North)}" East="${formatHand(board.hands.East)}" South="${formatHand(board.hands.South)}" West="${formatHand(board.hands.West)}" vuln="${board.vulnerability}" dealer="${board.dealer}" bidding="${bidding}" />`;
};


