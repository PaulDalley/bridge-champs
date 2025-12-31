import React, { useState } from 'react';
import { createEmptyBoard, validateBoard, validateCardCount } from '../../types/board.types';
import HandInput from './HandInput';

/**
 * Modern Bridge Board Editor
 * Clean, intuitive interface for creating bridge boards
 */
const BoardEditor = ({ 
  initialBoard = null, 
  onSave = () => {},
  onCancel = () => {},
}) => {
  const [board, setBoard] = useState(initialBoard || createEmptyBoard());
  const [errors, setErrors] = useState([]);

  const updateHand = (position, hand) => {
    setBoard({
      ...board,
      hands: {
        ...board.hands,
        [position]: hand,
      },
    });
  };

  const handleSave = () => {
    const boardValidation = validateBoard(board);
    const cardValidation = validateCardCount(board);
    
    const allErrors = [...boardValidation.errors, ...cardValidation.errors];
    
    if (allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }
    
    setErrors([]);
    onSave(board);
  };

  const positions = ['North', 'South', 'East', 'West'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Bridge Board</h2>
        
        {/* Board Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board Type
          </label>
          <div className="flex gap-4">
            {['single', 'double', 'full'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="boardType"
                  value={type}
                  checked={board.type === type}
                  onChange={(e) => setBoard({ ...board, type: e.target.value })}
                  className="mr-2"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Position Selection (for single/double) */}
        {board.type !== 'full' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={board.position || ''}
              onChange={(e) => setBoard({ ...board, position: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {board.type === 'single' ? (
                <>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </>
              ) : (
                <>
                  <option value="North/South">North/South</option>
                  <option value="East/West">East/West</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Vulnerability & Dealer */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vulnerability
            </label>
            <select
              value={board.vulnerability}
              onChange={(e) => setBoard({ ...board, vulnerability: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="None">None</option>
              <option value="NS">N/S</option>
              <option value="EW">E/W</option>
              <option value="All">All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dealer
            </label>
            <select
              value={board.dealer}
              onChange={(e) => setBoard({ ...board, dealer: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>

        {/* Hand Inputs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position) => (
              <HandInput
                key={position}
                position={position}
                hand={board.hands[position]}
                onChange={(hand) => updateHand(position, hand)}
              />
            ))}
          </div>
        </div>

        {/* Bidding */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bidding Sequence (separate with commas)
          </label>
          <input
            type="text"
            value={board.bidding.join(', ')}
            onChange={(e) => {
              const bidding = e.target.value.split(',').map(b => b.trim()).filter(b => b);
              setBoard({ ...board, bidding });
            }}
            placeholder="1NT, 3NT"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
            <ul className="list-disc list-inside text-red-700">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Save Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEditor;

