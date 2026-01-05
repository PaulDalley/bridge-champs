/**
 * Hand Input Component
 * Input cards for a single hand
 */

import React from 'react';
import { Row, Col, TextInput } from 'react-materialize';
import './HandInput.css';

const SUITS = [
  { key: 'spades', label: '♠ Spades', symbol: 'S' },
  { key: 'hearts', label: '♥ Hearts', symbol: 'H' },
  { key: 'diamonds', label: '♦ Diamonds', symbol: 'D' },
  { key: 'clubs', label: '♣ Clubs', symbol: 'C' },
];

const HandInput = ({ position, hand, onChange }) => {
  const handleSuitChange = (suit, value) => {
    // Convert input string to card array
    // Input: "AKQ" -> [{rank: 'A', suit: 'S'}, {rank: 'K', suit: 'S'}, ...]
    const cards = value
      .toUpperCase()
      .split('')
      .filter((char) => '23456789TJQKA'.includes(char))
      .map((rank) => ({
        rank,
        suit: SUITS.find((s) => s.key === suit)?.symbol || 'S',
      }));

    onChange(position, suit, cards);
  };

  const getSuitValue = (suit) => {
    if (!hand[suit] || hand[suit].length === 0) return '';
    return hand[suit].map((card) => card.rank).join('');
  };

  return (
    <div className="HandInput">
      <div className="HandInput-header">
        <strong>{position} Hand</strong>
      </div>
      <Row>
        {SUITS.map((suit) => (
          <Col s={6} m={3} key={suit.key}>
            <TextInput
              label={suit.label}
              value={getSuitValue(suit.key)}
              onChange={(e) => handleSuitChange(suit.key, e.target.value)}
              placeholder="e.g., AKQ"
              helpText="Enter cards: A K Q J T 9 8 7 6 5 4 3 2"
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HandInput;



