import React from 'react';
import { Button, Icon } from 'react-materialize';
import MakeBoard from '../BridgeBoard/MakeBoard';
import { makeBoardObjectFromString } from '../../helpers/helpers';
import './BoardManager.css';

/**
 * BoardManager - Visual component to manage MakeBoard tags
 * Shows all boards as visual cards that can be previewed, deleted, and reordered
 */
const BoardManager = ({ boards, onDelete, onMoveUp, onMoveDown, onInsertAtCursor }) => {
  if (!boards || boards.length === 0) {
    return null;
  }

  return (
    <div className="BoardManager-container">
      <div className="BoardManager-header">
        <strong style={{ fontSize: '1.6rem', color: '#0F4C3A' }}>
          📋 Bridge Boards ({boards.length})
        </strong>
        <div style={{ fontSize: '1.2rem', color: '#666', marginTop: '0.5rem' }}>
          Click "Insert Here" to place a board at your cursor position in the article. Boards without placeholders will be added at the end.
        </div>
      </div>
      
      <div className="BoardManager-list">
        {boards.map((boardItem, index) => {
          const { tag, id } = boardItem;
          
          // Extract board info from tag for display
          const boardTypeMatch = tag.match(/boardType="([^"]*)"/);
          const positionMatch = tag.match(/position="([^"]*)"/);
          const boardType = boardTypeMatch ? boardTypeMatch[1] : 'unknown';
          const position = positionMatch ? positionMatch[1] : 'unknown';
          
          return (
            <div key={id || index} className="BoardManager-item">
              <div className="BoardManager-item-header">
                <div className="BoardManager-item-info">
                  <strong>Board #{index + 1}</strong>
                  <span className="BoardManager-badge">{boardType}</span>
                  <span className="BoardManager-badge">{position}</span>
                </div>
                <div className="BoardManager-item-actions">
                  <Button
                    small
                    waves="light"
                    onClick={() => onInsertAtCursor && onInsertAtCursor(id)}
                    style={{ 
                      padding: '0 1rem', 
                      minWidth: 'auto',
                      backgroundColor: '#0F4C3A',
                      color: 'white',
                      marginRight: '0.5rem'
                    }}
                    title="Insert board at cursor position in article"
                  >
                    <Icon left>add_location</Icon>
                    Insert Here
                  </Button>
                  {index > 0 && (
                    <Button
                      small
                      flat
                      waves="light"
                      onClick={() => onMoveUp(index)}
                      style={{ padding: '0 0.5rem', minWidth: 'auto' }}
                    >
                      <Icon>arrow_upward</Icon>
                    </Button>
                  )}
                  {index < boards.length - 1 && (
                    <Button
                      small
                      flat
                      waves="light"
                      onClick={() => onMoveDown(index)}
                      style={{ padding: '0 0.5rem', minWidth: 'auto' }}
                    >
                      <Icon>arrow_downward</Icon>
                    </Button>
                  )}
                  <Button
                    small
                    flat
                    waves="light"
                    onClick={() => onDelete(index)}
                    style={{ padding: '0 0.5rem', minWidth: 'auto', color: '#d32f2f' }}
                  >
                    <Icon>delete</Icon>
                  </Button>
                </div>
              </div>
              
              <div className="BoardManager-item-preview">
                <div className="BoardManager-preview-label">Preview:</div>
                <div className="BoardManager-preview-content">
                  <MakeBoard
                    {...makeBoardObjectFromString(tag, true)}
                    getBidding={() => {}}
                    isQuiz={false}
                  />
                </div>
              </div>
              
              <div className="BoardManager-item-code">
                <div className="BoardManager-code-label">Tag:</div>
                <code className="BoardManager-code-content">
                  {tag.substring(0, 150)}{tag.length > 150 ? '...' : ''}
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardManager;

