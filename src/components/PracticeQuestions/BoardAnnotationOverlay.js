import React, { useRef, useEffect } from 'react';
import './BoardAnnotationOverlay.css';

/**
 * BoardAnnotationOverlay
 * Renders SVG annotations (lines, circles, arrows) over a bridge board
 * @param {Array} annotations - Array of annotation objects
 * @param {boolean} visible - Whether annotations should be visible
 * @param {number} boardWidth - Width of the board in pixels
 * @param {number} boardHeight - Height of the board in pixels
 */
const BoardAnnotationOverlay = ({ annotations = [], visible = false, boardWidth = 600, boardHeight = 400 }) => {
  const svgRef = useRef(null);

  if (!visible || !annotations || annotations.length === 0) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className="BoardAnnotationOverlay"
      width={boardWidth}
      height={boardHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {annotations.map((annotation, index) => {
        if (annotation.type === 'line') {
          return (
            <line
              key={index}
              x1={annotation.x1}
              y1={annotation.y1}
              x2={annotation.x2}
              y2={annotation.y2}
              stroke={annotation.color || '#ff0000'}
              strokeWidth={annotation.width || 2}
              strokeLinecap="round"
            />
          );
        } else if (annotation.type === 'circle') {
          return (
            <circle
              key={index}
              cx={annotation.cx}
              cy={annotation.cy}
              r={annotation.r || 20}
              fill="none"
              stroke={annotation.color || '#0000ff'}
              strokeWidth={annotation.width || 2}
            />
          );
        } else if (annotation.type === 'arrow') {
          // Arrow is a line with an arrowhead marker
          const dx = annotation.x2 - annotation.x1;
          const dy = annotation.y2 - annotation.y1;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          const arrowLength = 10;
          const arrowAngle = 30;
          
          return (
            <g key={index}>
              <line
                x1={annotation.x1}
                y1={annotation.y1}
                x2={annotation.x2}
                y2={annotation.y2}
                stroke={annotation.color || '#00ff00'}
                strokeWidth={annotation.width || 2}
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={annotation.color || '#00ff00'}
                  />
                </marker>
              </defs>
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
};

export default BoardAnnotationOverlay;

