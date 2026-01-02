/**
 * Bridge Board Data Types
 * Clean, structured format for bridge boards
 */

/**
 * @typedef {Object} Card
 * @property {string} rank - Card rank: 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'
 * @property {string} suit - Card suit: 'S' (spades), 'H' (hearts), 'D' (diamonds), 'C' (clubs)
 */

/**
 * @typedef {Object} Hand
 * @property {Card[]} spades - Spades in the hand
 * @property {Card[]} hearts - Hearts in the hand
 * @property {Card[]} diamonds - Diamonds in the hand
 * @property {Card[]} clubs - Clubs in the hand
 */

/**
 * @typedef {'none'|'ns'|'ew'|'both'} Vulnerability
 */

/**
 * @typedef {'North'|'South'|'East'|'West'} Position
 */

/**
 * @typedef {'single'|'double'|'full'} BoardType
 */

/**
 * @typedef {Object} BridgeBoard
 * @property {string} id - Unique board identifier
 * @property {BoardType} boardType - Type of board display
 * @property {Position} position - Which hand(s) to show (for single/double)
 * @property {Hand} north - North hand
 * @property {Hand} south - South hand
 * @property {Hand} east - East hand
 * @property {Hand} west - West hand
 * @property {Vulnerability} vulnerability - Vulnerability state
 * @property {Position} dealer - Dealer position
 * @property {string[]} bidding - Bidding sequence (e.g., ['1S', 'P', '2NT', 'P', '3S', 'P', 'P', 'P'])
 */

/**
 * Convert hand object to string format (for compatibility with old MakeBoard)
 * @param {Hand} hand
 * @returns {string} Format: "*S-AKQ*H-JT9*D-876*C-5432" (with suit prefixes and * separators)
 */
export const handToString = (hand) => {
  const suitMap = {
    spades: 'S',
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C'
  };
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const parts = suits
    .map((suit) => {
      if (!hand[suit] || hand[suit].length === 0) return '';
      const suitSymbol = suitMap[suit];
      const cards = hand[suit].map((card) => card.rank).join('');
      return `*${suitSymbol}-${cards}`;
    })
    .filter(part => part.length > 0);
  
  return parts.length > 0 ? parts.join('') : '';
};

/**
 * Parse string format to hand object
 * @param {string} handString - Format: "AKQ JT9 876 5432"
 * @returns {Hand}
 */
export const stringToHand = (handString) => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const parts = handString.split(' ').filter((p) => p.length > 0);
  
  const hand = {
    spades: [],
    hearts: [],
    diamonds: [],
    clubs: [],
  };
  
  parts.forEach((part, index) => {
    if (index < suits.length) {
      const suit = suits[index];
      const suitSymbol = suit === 'spades' ? 'S' : suit === 'hearts' ? 'H' : suit === 'diamonds' ? 'D' : 'C';
      hand[suit] = part.split('').map((rank) => ({ rank, suit: suitSymbol }));
    }
  });
  
  return hand;
};

/**
 * Create empty hand
 * @returns {Hand}
 */
export const createEmptyHand = () => ({
  spades: [],
  hearts: [],
  diamonds: [],
  clubs: [],
});

