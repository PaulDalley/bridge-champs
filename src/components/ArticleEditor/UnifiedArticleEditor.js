import React, { useState, useEffect } from 'react';
import { Button, Icon, Modal, TextInput, Textarea } from 'react-materialize';
import GenerateBridgeBoard from '../BridgeBoard/GenerateBridgeBoard';
import logger from '../../utils/logger';
import './UnifiedArticleEditor.css';

/**
 * Modern Unified Article Editor
 * 
 * Uses a block-based content structure instead of HTML strings.
 * This solves the MakeBoard tag stripping issue by storing MakeBoard
 * as structured data, not HTML.
 * 
 * Content Structure:
 * {
 *   blocks: [
 *     { id: '1', type: 'paragraph', content: 'Text here...' },
 *     { id: '2', type: 'heading', level: 2, content: 'Title' },
 *     { id: '3', type: 'makeboard', data: { hand: {...}, bidding: '...' } },
 *     { id: '4', type: 'video', url: 'https://youtube.com/...' }
 *   ]
 * }
 */

const UnifiedArticleEditor = ({
  initialContent = null, // Can be old HTML string or new blocks structure
  onChange = () => {}, // Called with new blocks structure
  placeholder = 'Start writing...',
  articleType = 'cardPlay', // For routing/navigation
}) => {
  const [blocks, setBlocks] = useState([]);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [showMakeBoardModal, setShowMakeBoardModal] = useState(false);
  const [pendingMakeBoardData, setPendingMakeBoardData] = useState(null);

  // Initialize: Convert old HTML format to blocks if needed
  useEffect(() => {
    if (initialContent) {
      if (typeof initialContent === 'string') {
        // Old HTML format - convert to blocks
        const convertedBlocks = convertHTMLToBlocks(initialContent);
        setBlocks(convertedBlocks);
        onChange(convertedBlocks);
      } else if (Array.isArray(initialContent)) {
        // New blocks format
        setBlocks(initialContent);
      } else if (initialContent.blocks) {
        // Wrapped in object
        setBlocks(initialContent.blocks);
      }
    } else {
      // Start with empty paragraph
      setBlocks([{ id: generateId(), type: 'paragraph', content: '' }]);
    }
  }, []);

  // Notify parent of changes
  useEffect(() => {
    if (blocks.length > 0) {
      onChange(blocks);
    }
  }, [blocks]);

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = (type, data = {}) => {
    const newBlock = {
      id: generateId(),
      type,
      ...data,
    };
    setBlocks([...blocks, newBlock]);
    return newBlock.id;
  };

  const updateBlock = (id, updates) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const handleMakeBoardGenerated = (makeBoardTag) => {
    // Parse the MakeBoard tag to extract data
    const data = parseMakeBoardTag(makeBoardTag);
    if (data) {
      setPendingMakeBoardData({ tag: makeBoardTag, data });
      setShowMakeBoardModal(false);
    }
  };

  const insertMakeBoard = () => {
    if (pendingMakeBoardData) {
      const blockId = addBlock('makeboard', {
        data: pendingMakeBoardData.data,
        tag: pendingMakeBoardData.tag, // Keep original tag for rendering
      });
      setPendingMakeBoardData(null);
      setEditingBlockId(blockId);
    }
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <ParagraphBlock
            key={block.id}
            block={block}
            isEditing={editingBlockId === block.id}
            onEdit={() => setEditingBlockId(block.id)}
            onUpdate={(content) => updateBlock(block.id, { content })}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            onAddAfter={(type) => {
              const newId = addBlock(type);
              setEditingBlockId(newId);
            }}
          />
        );
      case 'heading':
        return (
          <HeadingBlock
            key={block.id}
            block={block}
            isEditing={editingBlockId === block.id}
            onEdit={() => setEditingBlockId(block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            onAddAfter={(type) => {
              const newId = addBlock(type);
              setEditingBlockId(newId);
            }}
          />
        );
      case 'makeboard':
        return (
          <MakeBoardBlock
            key={block.id}
            block={block}
            isEditing={editingBlockId === block.id}
            onEdit={() => setEditingBlockId(block.id)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            onRegenerate={() => setShowMakeBoardModal(true)}
          />
        );
      case 'video':
        return (
          <VideoBlock
            key={block.id}
            block={block}
            isEditing={editingBlockId === block.id}
            onEdit={() => setEditingBlockId(block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
          />
        );
      default:
        return <div key={block.id}>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div className="UnifiedArticleEditor">
      {/* Toolbar */}
      <div className="UnifiedArticleEditor-toolbar">
        <Button
          waves="light"
          small
          onClick={() => {
            const newId = addBlock('heading', { level: 2, content: '' });
            setEditingBlockId(newId);
          }}
        >
          <Icon left>title</Icon>
          Heading
        </Button>
        <Button
          waves="light"
          small
          onClick={() => setShowMakeBoardModal(true)}
        >
          <Icon left>grid_on</Icon>
          Add Board
        </Button>
        <Button
          waves="light"
          small
          onClick={() => {
            const newId = addBlock('video', { url: '' });
            setEditingBlockId(newId);
          }}
        >
          <Icon left>video_library</Icon>
          Video
        </Button>
      </div>

      {/* Pending MakeBoard insertion */}
      {pendingMakeBoardData && (
        <div className="UnifiedArticleEditor-pending-board">
          <div>MakeBoard ready to insert</div>
          <Button waves="light" onClick={insertMakeBoard}>
            Insert Board
          </Button>
          <Button waves="light" flat onClick={() => setPendingMakeBoardData(null)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Blocks */}
      <div className="UnifiedArticleEditor-blocks">
        {blocks.map(block => renderBlock(block))}
      </div>

      {/* MakeBoard Generator Modal */}
      <Modal
        header="Create Bridge Board"
        open={showMakeBoardModal}
        options={{
          onCloseEnd: () => setShowMakeBoardModal(false),
        }}
      >
        <GenerateBridgeBoard onBoardGenerated={handleMakeBoardGenerated} />
      </Modal>
    </div>
  );
};

// Block Components
const ParagraphBlock = ({ block, isEditing, onEdit, onUpdate, onDelete, onMoveUp, onMoveDown, onAddAfter }) => {
  if (isEditing) {
    return (
      <div className="ArticleBlock ArticleBlock--editing">
        <Textarea
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Type your paragraph..."
          style={{ minHeight: '100px', fontSize: '1.6rem' }}
        />
        <div className="ArticleBlock-actions">
          <Button waves="light" small flat onClick={() => onEdit(null)}>
            Done
          </Button>
          <Button waves="light" small onClick={() => onAddAfter('heading')}>
            Add Heading
          </Button>
          <Button waves="light" small onClick={() => onAddAfter('paragraph')}>
            Add Paragraph
          </Button>
          <Button waves="light" small flat onClick={onDelete}>
            <Icon>delete</Icon>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ArticleBlock" onClick={onEdit}>
      <p>{block.content || <span style={{ color: '#999' }}>Empty paragraph (click to edit)</span>}</p>
      <div className="ArticleBlock-actions">
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveUp(); }}>
          <Icon>arrow_upward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveDown(); }}>
          <Icon>arrow_downward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

const HeadingBlock = ({ block, isEditing, onEdit, onUpdate, onDelete, onMoveUp, onMoveDown, onAddAfter }) => {
  const level = block.level || 2;
  const Tag = `h${level}`;

  if (isEditing) {
    return (
      <div className="ArticleBlock ArticleBlock--editing">
        <select
          value={level}
          onChange={(e) => onUpdate({ level: parseInt(e.target.value) })}
          style={{ marginBottom: '1rem', fontSize: '1.4rem' }}
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <TextInput
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Heading text..."
          style={{ fontSize: '1.8rem' }}
        />
        <div className="ArticleBlock-actions">
          <Button waves="light" small flat onClick={() => onEdit(null)}>
            Done
          </Button>
          <Button waves="light" small flat onClick={onDelete}>
            <Icon>delete</Icon>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ArticleBlock" onClick={onEdit}>
      <Tag>{block.content || <span style={{ color: '#999' }}>Empty heading (click to edit)</span>}</Tag>
      <div className="ArticleBlock-actions">
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveUp(); }}>
          <Icon>arrow_upward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveDown(); }}>
          <Icon>arrow_downward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

const MakeBoardBlock = ({ block, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, onRegenerate }) => {
  // For now, render using the existing MakeBoard component
  // The tag is stored in block.tag
  return (
    <div className="ArticleBlock ArticleBlock--makeboard">
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Bridge Board</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          {block.tag ? block.tag.substring(0, 100) + '...' : 'No board data'}
        </div>
      </div>
      <div className="ArticleBlock-actions">
        <Button waves="light" small onClick={onRegenerate}>
          Regenerate
        </Button>
        <Button waves="light" small flat onClick={onMoveUp}>
          <Icon>arrow_upward</Icon>
        </Button>
        <Button waves="light" small flat onClick={onMoveDown}>
          <Icon>arrow_downward</Icon>
        </Button>
        <Button waves="light" small flat onClick={onDelete}>
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

const VideoBlock = ({ block, isEditing, onEdit, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  if (isEditing) {
    return (
      <div className="ArticleBlock ArticleBlock--editing">
        <TextInput
          value={block.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="YouTube URL..."
          label="Video URL"
        />
        <div className="ArticleBlock-actions">
          <Button waves="light" small flat onClick={() => onEdit(null)}>
            Done
          </Button>
          <Button waves="light" small flat onClick={onDelete}>
            <Icon>delete</Icon>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ArticleBlock" onClick={onEdit}>
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Video:</strong> {block.url || 'No URL (click to edit)'}
      </div>
      <div className="ArticleBlock-actions">
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveUp(); }}>
          <Icon>arrow_upward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onMoveDown(); }}>
          <Icon>arrow_downward</Icon>
        </Button>
        <Button waves="light" small flat onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

// Utility Functions
function convertHTMLToBlocks(html) {
  // Simple conversion: split by MakeBoard tags and convert to blocks
  const blocks = [];
  const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = makeBoardRegex.exec(html)) !== null) {
    // Add text before MakeBoard as paragraph
    const textBefore = html.substring(lastIndex, match.index).trim();
    if (textBefore) {
      // Split by headings and paragraphs
      const paragraphs = textBefore.split(/(<h[1-3]>.*?<\/h[1-3]>)/g);
      paragraphs.forEach(p => {
        const headingMatch = p.match(/<h([1-3])>(.*?)<\/h[1-3]>/);
        if (headingMatch) {
          blocks.push({
            id: `block_${Date.now()}_${Math.random()}`,
            type: 'heading',
            level: parseInt(headingMatch[1]),
            content: headingMatch[2],
          });
        } else if (p.trim()) {
          blocks.push({
            id: `block_${Date.now()}_${Math.random()}`,
            type: 'paragraph',
            content: p.replace(/<[^>]+>/g, '').trim(), // Strip HTML tags
          });
        }
      });
    }
    
    // Add MakeBoard block
    const data = parseMakeBoardTag(match[0]);
    blocks.push({
      id: `block_${Date.now()}_${Math.random()}`,
      type: 'makeboard',
      tag: match[0],
      data: data || {},
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  const remainingText = html.substring(lastIndex).trim();
  if (remainingText) {
    const paragraphs = remainingText.split(/(<h[1-3]>.*?<\/h[1-3]>)/g);
    paragraphs.forEach(p => {
      const headingMatch = p.match(/<h([1-3])>(.*?)<\/h[1-3]>/);
      if (headingMatch) {
        blocks.push({
          id: `block_${Date.now()}_${Math.random()}`,
          type: 'heading',
          level: parseInt(headingMatch[1]),
          content: headingMatch[2],
        });
      } else if (p.trim()) {
        blocks.push({
          id: `block_${Date.now()}_${Math.random()}`,
          type: 'paragraph',
          content: p.replace(/<[^>]+>/g, '').trim(),
        });
      }
    });
  }
  
  // If no blocks, add empty paragraph
  if (blocks.length === 0) {
    blocks.push({
      id: `block_${Date.now()}_${Math.random()}`,
      type: 'paragraph',
      content: html.replace(/<[^>]+>/g, '').trim() || '',
    });
  }
  
  return blocks;
}

function parseMakeBoardTag(tag) {
  // Extract attributes from MakeBoard tag
  // Format: <MakeBoard hand="..." bidding="..." ... />
  try {
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let match;
    while ((match = attrRegex.exec(tag)) !== null) {
      attrs[match[1]] = match[2];
    }
    return attrs;
  } catch (e) {
    logger.error('Error parsing MakeBoard tag:', e);
    return null;
  }
}

// Convert blocks back to HTML for backward compatibility
export function blocksToHTML(blocks) {
  let html = '';
  blocks.forEach(block => {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${escapeHTML(block.content || '')}</p>`;
        break;
      case 'heading':
        html += `<h${block.level || 2}>${escapeHTML(block.content || '')}</h${block.level || 2}>`;
        break;
      case 'makeboard':
        html += block.tag || '';
        break;
      case 'video':
        html += `<Video url="${escapeHTML(block.url || '')}" />`;
        break;
    }
  });
  return html;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default UnifiedArticleEditor;

