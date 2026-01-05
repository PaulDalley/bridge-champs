/**
 * Board Utility Functions
 */

/**
 * Gets the positions to display based on board type
 * @param {BridgeBoard} board
 * @returns {string[]}
 */
export const getDisplayPositions = (board) => {
  switch (board.type) {
    case 'single':
      return [board.position || 'North'];
    case 'double':
      return (board.position || 'North/South').split('/');
    case 'full':
      return ['North', 'East', 'South', 'West'];
    default:
      return ['North'];
  }
};

/**
 * Formats bidding sequence for display
 * @param {string[]} bidding
 * @returns {string}
 */
export const formatBidding = (bidding) => {
  if (!bidding || bidding.length === 0) return '';
  return bidding.join(' / ');
};

/**
 * Gets vulnerability display text
 * @param {string} vulnerability
 * @returns {string}
 */
export const getVulnerabilityText = (vulnerability) => {
  const map = {
    'None': 'None Vul',
    'NS': 'Vul N/S',
    'EW': 'Vul E/W',
    'All': 'All Vul',
  };
  return map[vulnerability] || vulnerability;
};

/**
 * Counts total cards in a hand
 * @param {Hand} hand
 * @returns {number}
 */
export const countCardsInHand = (hand) => {
  return (hand.spades?.length || 0) +
         (hand.hearts?.length || 0) +
         (hand.diamonds?.length || 0) +
         (hand.clubs?.length || 0);
};

/**
 * Validates that all hands have 13 cards total
 * @param {BridgeBoard} board
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateCardCount = (board) => {
  const errors = [];
  const positions = ['North', 'South', 'East', 'West'];
  
  for (const pos of positions) {
    const count = countCardsInHand(board.hands[pos]);
    if (count !== 13) {
      errors.push(`${pos} has ${count} cards (should be 13)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};



