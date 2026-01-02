import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon, Select } from 'react-materialize';
import MakeBoard from '../BridgeBoard/MakeBoard';
import BoardAnnotationOverlay from './BoardAnnotationOverlay';
import './AnnotationDrawer.css';

/**
 * AnnotationDrawer
 * Allows admins to draw annotations (lines, circles, arrows) on bridge boards
 */
const AnnotationDrawer = ({ boardData, annotations = [], onSave, onCancel }) => {
  const [drawingMode, setDrawingMode] = useState('line'); // 'line', 'circle', 'arrow'
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [currentAnnotations, setCurrentAnnotations] = useState(annotations);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [previewAnnotation, setPreviewAnnotation] = useState(null);
  const boardContainerRef = useRef(null);
  const [boardDimensions, setBoardDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    setCurrentAnnotations(annotations);
  }, [annotations]);

  useEffect(() => {
    const measureBoard = () => {
      if (boardContainerRef.current) {
        const rect = boardContainerRef.current.getBoundingClientRect();
        setBoardDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const timer = setTimeout(measureBoard, 100);
    window.addEventListener('resize', measureBoard);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureBoard);
    };
  }, []);

  const getMousePosition = (e) => {
    if (!boardContainerRef.current) return null;
    const rect = boardContainerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePosition(e);
    if (!pos) return;

    setIsDrawing(true);
    setStartPoint(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPoint) return;

    const pos = getMousePosition(e);
    if (!pos) return;

    if (drawingMode === 'line' || drawingMode === 'arrow') {
      setPreviewAnnotation({
        type: drawingMode,
        x1: startPoint.x,
        y1: startPoint.y,
        x2: pos.x,
        y2: pos.y,
        color: currentColor,
        width: 2,
      });
    } else if (drawingMode === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2)
      );
      setPreviewAnnotation({
        type: 'circle',
        cx: startPoint.x,
        cy: startPoint.y,
        r: radius,
        color: currentColor,
        width: 2,
      });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !startPoint) return;

    const pos = getMousePosition(e);
    if (!pos) return;

    let newAnnotation;

    if (drawingMode === 'line' || drawingMode === 'arrow') {
      newAnnotation = {
        type: drawingMode,
        x1: startPoint.x,
        y1: startPoint.y,
        x2: pos.x,
        y2: pos.y,
        color: currentColor,
        width: 2,
      };
    } else if (drawingMode === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2)
      );
      newAnnotation = {
        type: 'circle',
        cx: startPoint.x,
        cy: startPoint.y,
        r: Math.max(radius, 10), // Minimum radius
        color: currentColor,
        width: 2,
      };
    }

    if (newAnnotation) {
      setCurrentAnnotations([...currentAnnotations, newAnnotation]);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setPreviewAnnotation(null);
  };

  const handleDeleteAnnotation = (index) => {
    const newAnnotations = currentAnnotations.filter((_, i) => i !== index);
    setCurrentAnnotations(newAnnotations);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all annotations?')) {
      setCurrentAnnotations([]);
    }
  };

  const handleSave = () => {
    onSave(currentAnnotations);
  };

  // Convert boardData to MakeBoard props format
  const makeBoardProps = boardData ? {
    boardType: boardData.boardType || 'full',
    position: boardData.position || 'full',
    North: boardData.north ? formatHandString(boardData.north) : '',
    South: boardData.south ? formatHandString(boardData.south) : '',
    East: boardData.east ? formatHandString(boardData.east) : '',
    West: boardData.west ? formatHandString(boardData.west) : '',
    vuln: boardData.vulnerability || 'none',
    dealer: boardData.dealer || 'North',
    bidding: boardData.bidding ? (Array.isArray(boardData.bidding) ? boardData.bidding.join('/') : boardData.bidding) : '',
  } : null;

  return (
    <div className="AnnotationDrawer">
      <div className="AnnotationDrawer-toolbar">
        <div className="AnnotationDrawer-tools">
          <Select
            value={drawingMode}
            onChange={(e) => setDrawingMode(e.target.value)}
            label="Tool"
          >
            <option value="line">Line</option>
            <option value="circle">Circle</option>
            <option value="arrow">Arrow</option>
          </Select>

          <Select
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            label="Color"
          >
            <option value="#ff0000">Red</option>
            <option value="#0000ff">Blue</option>
            <option value="#00ff00">Green</option>
            <option value="#ff00ff">Magenta</option>
            <option value="#ffff00">Yellow</option>
            <option value="#000000">Black</option>
          </Select>
        </div>

        <div className="AnnotationDrawer-actions">
          <Button onClick={handleClearAll} small className="red">
            Clear All
          </Button>
          <Button onClick={handleSave} className="green">
            <Icon left>save</Icon>
            Save Annotations
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="AnnotationDrawer-board-container">
        <div
          ref={boardContainerRef}
          className="AnnotationDrawer-board-wrapper"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDrawing(false);
            setPreviewAnnotation(null);
          }}
          style={{ position: 'relative', cursor: 'crosshair' }}
        >
          {makeBoardProps && (
            <MakeBoard {...makeBoardProps} />
          )}
          
          {/* Existing annotations */}
          <BoardAnnotationOverlay
            annotations={currentAnnotations}
            visible={true}
            boardWidth={boardDimensions.width}
            boardHeight={boardDimensions.height}
          />
          
          {/* Preview annotation while drawing */}
          {previewAnnotation && (
            <BoardAnnotationOverlay
              annotations={[previewAnnotation]}
              visible={true}
              boardWidth={boardDimensions.width}
              boardHeight={boardDimensions.height}
            />
          )}
        </div>
      </div>

      <div className="AnnotationDrawer-annotations-list">
        <h4>Annotations ({currentAnnotations.length})</h4>
        {currentAnnotations.length === 0 ? (
          <p>No annotations yet. Click and drag on the board to draw.</p>
        ) : (
          <div className="AnnotationDrawer-annotations-items">
            {currentAnnotations.map((annotation, index) => (
              <div key={index} className="AnnotationDrawer-annotation-item">
                <span>
                  {annotation.type} ({annotation.color})
                </span>
                <Button
                  onClick={() => handleDeleteAnnotation(index)}
                  small
                  className="red"
                >
                  <Icon>delete</Icon>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format hand object to string format
const formatHandString = (hand) => {
  if (!hand) return '';
  const suits = ['S', 'H', 'D', 'C'];
  const parts = suits.map(suit => {
    const cards = hand[suit] || '';
    return cards ? `*${suit}-${cards}` : '';
  }).filter(Boolean);
  return parts.join('');
};

export default AnnotationDrawer;

