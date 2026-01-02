import React from 'react';
import { getDisplayPositions, formatBidding, getVulnerabilityText } from '../../utils/boardUtils';

/**
 * Modern Bridge Board Display Component
 * Clean, visual display of bridge boards
 */
const BoardDisplay = ({ board, className = '' }) => {
  if (!board) return null;

  const displayPositions = getDisplayPositions(board);

  const HandDisplay = ({ position, hand }) => {
    const suits = [
      { key: 'spades', symbol: '♠', color: 'text-black' },
      { key: 'hearts', symbol: '♥', color: 'text-red-600' },
      { key: 'diamonds', symbol: '♦', color: 'text-red-600' },
      { key: 'clubs', symbol: '♣', color: 'text-black' },
    ];

    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{position}</h3>
        <div className="space-y-2">
          {suits.map(({ key, symbol, color }) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`text-xl font-bold w-6 ${color}`}>{symbol}</span>
              <span className="text-lg text-gray-800 font-mono">
                {hand[key] || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bridge Board</h2>
          <p className="text-sm text-gray-600 capitalize">{board.type} board</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Vulnerability:</span> {getVulnerabilityText(board.vulnerability)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Dealer:</span> {board.dealer}
          </div>
        </div>
      </div>

      {/* Hands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {displayPositions.map((position) => (
          <HandDisplay
            key={position}
            position={position}
            hand={board.hands[position]}
          />
        ))}
      </div>

      {/* Bidding */}
      {board.bidding && board.bidding.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bidding</h3>
          <div className="text-lg text-gray-700 font-mono">
            {formatBidding(board.bidding)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDisplay;


