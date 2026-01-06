/**
 * Modern Bridge Board Type Definitions
 * 
 * JSON-based structure instead of string format
 * Type-safe and easy to work with
 */

/**
 * @typedef {Object} Hand
 * @property {string} spades - Card ranks (e.g., "AKQ")
 * @property {string} hearts - Card ranks (e.g., "J10")
 * @property {string} diamonds - Card ranks (e.g., "5432")
 * @property {string} clubs - Card ranks (e.g., "AK")
 */

/**
 * @typedef {Object} BridgeBoard
 * @property {string} id - Unique identifier
 * @property {'single'|'double'|'full'} type - Board type
 * @property {string} [position] - Position for single/double (e.g., "North", "North/South")
 * @property {Object<string, Hand>} hands - Hands for each position
 * @property {'None'|'NS'|'EW'|'All'} vulnerability - Vulnerability
 * @property {'North'|'South'|'East'|'West'} dealer - Dealer position
 * @property {string[]} bidding - Bidding sequence (e.g., ["1NT", "3NT"])
 */

/**
 * Creates an empty hand
 * @returns {Hand}
 */
export const createEmptyHand = () => ({
  spades: '',
  hearts: '',
  diamonds: '',
  clubs: '',
});

/**
 * Creates an empty board
 * @returns {BridgeBoard}
 */
export const createEmptyBoard = () => ({
  id: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type: 'single',
  position: 'North',
  hands: {
    North: createEmptyHand(),
    South: createEmptyHand(),
    East: createEmptyHand(),
    West: createEmptyHand(),
  },
  vulnerability: 'None',
  dealer: 'North',
  bidding: [],
});

/**
 * Validates a hand
 * @param {Hand} hand
 * @returns {boolean}
 */
export const validateHand = (hand) => {
  const validRanks = /^[AKQJT98765432]*$/;
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  
  for (const suit of suits) {
    if (hand[suit] && !validRanks.test(hand[suit])) {
      return false;
    }
  }
  
  return true;
};

/**
 * Validates a board
 * @param {BridgeBoard} board
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateBoard = (board) => {
  const errors = [];
  
  if (!board.type || !['single', 'double', 'full'].includes(board.type)) {
    errors.push('Invalid board type');
  }
  
  if (!board.hands) {
    errors.push('Missing hands');
  } else {
    const positions = ['North', 'South', 'East', 'West'];
    for (const pos of positions) {
      if (!validateHand(board.hands[pos])) {
        errors.push(`Invalid hand for ${pos}`);
      }
    }
  }
  
  if (!board.dealer || !['North', 'South', 'East', 'West'].includes(board.dealer)) {
    errors.push('Invalid dealer');
  }
  
  if (!board.vulnerability || !['None', 'NS', 'EW', 'All'].includes(board.vulnerability)) {
    errors.push('Invalid vulnerability');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};




