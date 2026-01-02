/**
 * Bridge Board Creator - V2
 * Modern, clean interface for creating bridge boards
 */

import React, { useState } from 'react';
import { Button, Icon, Select, TextInput, Row, Col } from 'react-materialize';
import { createEmptyHand, handToString } from '../../types/board.types';
import HandInput from './HandInput';
import BiddingInput from './BiddingInput';
import './BridgeBoardCreator.css';

const BridgeBoardCreator = ({ onBoardCreated, onCancel }) => {
  const [boardType, setBoardType] = useState('full');
  const [position, setPosition] = useState('North');
  const [vulnerability, setVulnerability] = useState('none');
  const [dealer, setDealer] = useState('North');
  const [bidding, setBidding] = useState([]);
  
  const [hands, setHands] = useState({
    North: createEmptyHand(),
    South: createEmptyHand(),
    East: createEmptyHand(),
    West: createEmptyHand(),
  });

  const handleHandChange = (position, suit, cards) => {
    setHands((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        [suit]: cards,
      },
    }));
  };

  const handleCreate = () => {
    console.log('=== BridgeBoardCreator handleCreate ===');
    console.log('onBoardCreated exists?', !!onBoardCreated);
    
    const board = {
      id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      boardType,
      position: boardType === 'full' ? 'full' : position,
      vulnerability,
      dealer,
      bidding,
      north: hands.North,
      south: hands.South,
      east: hands.East,
      west: hands.West,
    };

    // Convert to MakeBoard tag for backward compatibility
    const northStr = handToString(hands.North);
    const southStr = handToString(hands.South);
    const eastStr = handToString(hands.East);
    const westStr = handToString(hands.West);
    const biddingStr = bidding.join('/');

    const makeBoardTag = `<MakeBoard boardType="${boardType}" position="${boardType === 'full' ? 'full' : position}" North="${northStr}" South="${southStr}" East="${eastStr}" West="${westStr}" vuln="${vulnerability}" dealer="${dealer}" bidding="${biddingStr}" />`;

    console.log('Generated makeBoardTag:', makeBoardTag);
    console.log('Calling onBoardCreated with:', { board, makeBoardTag });
    
    if (onBoardCreated) {
      onBoardCreated({
        board, // Structured format
        makeBoardTag, // Backward compatible tag
      });
    } else {
      console.error('onBoardCreated callback is missing!');
    }
  };

  return (
    <div className="BridgeBoardCreator">
      <div className="BridgeBoardCreator-header">
        <h4>Create Bridge Board</h4>
      </div>

      <div className="BridgeBoardCreator-content">
        {/* Board Type Selection */}
        <Row>
          <Col s={12} m={4}>
            <Select
              value={boardType}
              onChange={(e) => {
                setBoardType(e.target.value);
                if (e.target.value === 'single') {
                  setPosition('North');
                } else if (e.target.value === 'double') {
                  setPosition('North/South');
                }
              }}
              label="Board Type"
            >
              <option value="single">Single Hand</option>
              <option value="double">Two Hands</option>
              <option value="full">Full Board (All 4 Hands)</option>
            </Select>
          </Col>

          {boardType === 'single' && (
            <Col s={12} m={4}>
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                label="Show Hand"
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </Select>
            </Col>
          )}

          {boardType === 'double' && (
            <Col s={12} m={4}>
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                label="Show Hands"
              >
                <option value="North/South">North/South</option>
                <option value="East/West">East/West</option>
                <option value="North/East">North/East</option>
                <option value="South/West">South/West</option>
              </Select>
            </Col>
          )}
        </Row>

        {/* Vulnerability and Dealer */}
        <Row>
          <Col s={12} m={6}>
            <Select
              value={vulnerability}
              onChange={(e) => setVulnerability(e.target.value)}
              label="Vulnerability"
            >
              <option value="none">None Vulnerable</option>
              <option value="ns">North-South Vulnerable</option>
              <option value="ew">East-West Vulnerable</option>
              <option value="both">Both Vulnerable</option>
            </Select>
          </Col>

          <Col s={12} m={6}>
            <Select
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              label="Dealer"
            >
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </Select>
          </Col>
        </Row>

        {/* Hand Inputs */}
        <div className="BridgeBoardCreator-hands">
          {(boardType === 'full' || position.includes('North')) && (
            <HandInput
              position="North"
              hand={hands.North}
              onChange={handleHandChange}
            />
          )}

          {(boardType === 'full' || position.includes('South')) && (
            <HandInput
              position="South"
              hand={hands.South}
              onChange={handleHandChange}
            />
          )}

          {(boardType === 'full' || position.includes('East')) && (
            <HandInput
              position="East"
              hand={hands.East}
              onChange={handleHandChange}
            />
          )}

          {(boardType === 'full' || position.includes('West')) && (
            <HandInput
              position="West"
              hand={hands.West}
              onChange={handleHandChange}
            />
          )}
        </div>

        {/* Bidding */}
        <BiddingInput
          bidding={bidding}
          onChange={setBidding}
          vulnerability={vulnerability}
          dealer={dealer}
        />

        {/* Actions */}
        <div className="BridgeBoardCreator-actions">
          <Button
            waves="light"
            onClick={handleCreate}
            style={{ backgroundColor: '#0F4C3A', marginRight: '1rem' }}
          >
            <Icon left>add</Icon>
            Create Board
          </Button>
          {onCancel && (
            <Button waves="light" flat onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BridgeBoardCreator;

