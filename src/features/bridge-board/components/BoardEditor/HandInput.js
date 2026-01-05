import React from 'react';
import { createEmptyHand } from '../../types/board.types';

/**
 * Modern Hand Input Component
 * Clean, intuitive interface for entering cards
 */
const HandInput = ({ position, hand, onChange, className = '' }) => {
  const handleSuitChange = (suit, value) => {
    // Only allow valid card ranks
    const validRanks = value.replace(/[^AKQJT98765432]/gi, '').toUpperCase();
    onChange({
      ...hand,
      [suit]: validRanks,
    });
  };

  const suits = [
    { key: 'spades', symbol: '♠', color: 'text-black' },
    { key: 'hearts', symbol: '♥', color: 'text-red-600' },
    { key: 'diamonds', symbol: '♦', color: 'text-red-600' },
    { key: 'clubs', symbol: '♣', color: 'text-black' },
  ];

  const cardCount = (hand.spades?.length || 0) + 
                   (hand.hearts?.length || 0) + 
                   (hand.diamonds?.length || 0) + 
                   (hand.clubs?.length || 0);

  return (
    <div className={`border border-gray-300 rounded-lg p-4 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{position}</h3>
        <span className={`text-sm font-medium ${cardCount === 13 ? 'text-green-600' : 'text-red-600'}`}>
          {cardCount} / 13 cards
        </span>
      </div>
      
      <div className="space-y-2">
        {suits.map(({ key, symbol, color }) => (
          <div key={key} className="flex items-center gap-3">
            <span className={`text-xl font-bold w-6 ${color}`}>{symbol}</span>
            <input
              type="text"
              value={hand[key] || ''}
              onChange={(e) => handleSuitChange(key, e.target.value)}
              placeholder="AKQ..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              maxLength={13}
            />
            <span className="text-sm text-gray-500 w-8">
              {(hand[key] || '').length}
            </span>
          </div>
        ))}
      </div>
      
      {cardCount !== 13 && (
        <div className="mt-3 text-sm text-red-600">
          ⚠️ Hand must have exactly 13 cards
        </div>
      )}
    </div>
  );
};

export default HandInput;



