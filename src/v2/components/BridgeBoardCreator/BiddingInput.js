/**
 * Bidding Input Component
 * Input bidding sequence
 */

import React, { useState } from 'react';
import { Button, Icon, TextInput, Row, Col } from 'react-materialize';
import './BiddingInput.css';

const BID_OPTIONS = [
  '1C', '1D', '1H', '1S', '1NT',
  '2C', '2D', '2H', '2S', '2NT',
  '3C', '3D', '3H', '3S', '3NT',
  '4C', '4D', '4H', '4S', '4NT',
  '5C', '5D', '5H', '5S', '5NT',
  '6C', '6D', '6H', '6S', '6NT',
  '7C', '7D', '7H', '7S', '7NT',
  'P', 'X', 'XX',
];

const BiddingInput = ({ bidding, onChange, vulnerability, dealer }) => {
  const [customBid, setCustomBid] = useState('');

  const handleAddBid = (bid) => {
    onChange([...bidding, bid]);
  };

  const handleRemoveLast = () => {
    onChange(bidding.slice(0, -1));
  };

  const handleClear = () => {
    onChange([]);
  };

  const handleCustomBid = () => {
    if (customBid.trim()) {
      handleAddBid(customBid.trim().toUpperCase());
      setCustomBid('');
    }
  };

  return (
    <div className="BiddingInput">
      <div className="BiddingInput-header">
        <strong>Bidding Sequence</strong>
        <div className="BiddingInput-info">
          Dealer: {dealer} | Vulnerability: {vulnerability === 'none' ? 'None' : vulnerability.toUpperCase()}
        </div>
      </div>

      {/* Current Bidding */}
      {bidding.length > 0 && (
        <div className="BiddingInput-current">
          <strong>Current: </strong>
          {bidding.map((bid, idx) => (
            <span key={idx} className="BiddingInput-bid">
              {bid}
            </span>
          ))}
        </div>
      )}

      {/* Quick Bid Buttons */}
      <div className="BiddingInput-quick">
        {BID_OPTIONS.map((bid) => (
          <Button
            key={bid}
            small
            waves="light"
            onClick={() => handleAddBid(bid)}
            style={{ margin: '0.25rem' }}
          >
            {bid}
          </Button>
        ))}
      </div>

      {/* Custom Bid Input */}
      <Row>
        <Col s={8}>
          <TextInput
            label="Custom Bid"
            value={customBid}
            onChange={(e) => setCustomBid(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCustomBid();
              }
            }}
            placeholder="e.g., 1S, 2NT, P"
          />
        </Col>
        <Col s={4}>
          <Button
            waves="light"
            onClick={handleCustomBid}
            style={{ marginTop: '1.5rem' }}
          >
            Add
          </Button>
        </Col>
      </Row>

      {/* Actions */}
      <div className="BiddingInput-actions">
        <Button small waves="light" flat onClick={handleRemoveLast}>
          <Icon left>arrow_back</Icon>
          Remove Last
        </Button>
        <Button small waves="light" flat onClick={handleClear}>
          <Icon left>clear</Icon>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default BiddingInput;




