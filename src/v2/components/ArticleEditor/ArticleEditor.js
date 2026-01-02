/**
 * Article Editor - V2
 * Modern TipTap-based editor with inline board insertion
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button, Icon, Modal } from 'react-materialize';
import BridgeBoardCreator from '../BridgeBoardCreator/BridgeBoardCreator';
import { boardToMakeBoardTag } from '../../utils/boardMigration';
import './ArticleEditor.css';

const ArticleEditor = ({ content, onChange, onBoardAdded, placeholder = 'Start writing your article...' }) => {
  const [showBoardCreator, setShowBoardCreator] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    parseOptions: {
      preserveWhitespace: 'full',
    },
    editorProps: {
      attributes: {
        class: 'ArticleEditor-prose',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when content prop changes (for loading articles)
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getHTML();
      if (content !== currentContent) {
        editor.commands.setContent(content || '');
      }
    }
  }, [content, editor]);

  const handleInsertBoard = useCallback(({ board, makeBoardTag }) => {
    console.log('=== BOARD INSERT DEBUG ===');
    console.log('makeBoardTag:', makeBoardTag);
    console.log('onBoardAdded exists?', !!onBoardAdded);
    
    if (!editor) {
      console.error('Editor not available');
      return;
    }

    // Generate unique placeholder ID
    const placeholderId = `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the board tag with its placeholder ID
    if (onBoardAdded) {
      console.log('Calling onBoardAdded with placeholder:', placeholderId);
      onBoardAdded(makeBoardTag, placeholderId);
    } else {
      console.error('onBoardAdded callback not provided!');
      return;
    }
    
    // Insert placeholder with unique ID embedded directly in text
    // Format: [BRIDGE_BOARD:unique_id] - more robust for copy/paste
    editor.chain().focus().insertContent(`<p>[BRIDGE_BOARD:${placeholderId}]</p>`).run();
    
    setShowBoardCreator(false);
  }, [editor, onBoardAdded]);

  const handleOpenBoardCreator = () => {
    setShowBoardCreator(true);
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="ArticleEditor">
      {/* Toolbar */}
      <div className="ArticleEditor-toolbar">
        <div className="ArticleEditor-toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            title="Bold"
          >
            <Icon>format_bold</Icon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
            title="Italic"
          >
            <Icon>format_italic</Icon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
            title="Strikethrough"
          >
            <Icon>strikethrough_s</Icon>
          </button>
        </div>

        <div className="ArticleEditor-toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="ArticleEditor-toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
            title="Bullet List"
          >
            <Icon>format_list_bulleted</Icon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
            title="Numbered List"
          >
            <Icon>format_list_numbered</Icon>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
            title="Quote"
          >
            <Icon>format_quote</Icon>
          </button>
        </div>

        <div className="ArticleEditor-toolbar-divider" />

        {/* Quick Board Insert Button */}
        <Button
          small
          waves="light"
          onClick={handleOpenBoardCreator}
          style={{ backgroundColor: '#0F4C3A', marginLeft: '1rem' }}
          title="Insert Bridge Board"
        >
          <Icon left>dashboard</Icon>
          Add Board
        </Button>
      </div>

      {/* Editor Content */}
      <div className="ArticleEditor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Board Creator Modal */}
      {showBoardCreator && (
        <Modal
          header="Create Bridge Board"
          open={showBoardCreator}
          options={{
            onCloseEnd: () => setShowBoardCreator(false),
            dismissible: true,
          }}
        >
          <BridgeBoardCreator
            onBoardCreated={handleInsertBoard}
            onCancel={() => setShowBoardCreator(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ArticleEditor;

