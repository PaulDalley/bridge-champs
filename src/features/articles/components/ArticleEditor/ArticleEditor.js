import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { MakeBoardExtension } from './MakeBoardExtension';
import { BoardEditor } from '../../../bridge-board';
import './ArticleEditor.css';

/**
 * Modern Article Editor with TipTap
 * 
 * Features:
 * - Rich text editing
 * - MakeBoard blocks (no tag stripping!)
 * - Video embeds
 * - Clean, modern UI
 */
const ArticleEditor = ({
  content = '',
  onChange = () => {},
  placeholder = 'Start writing...',
  onInsertMakeBoard = null,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      MakeBoardExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const insertMakeBoard = useCallback((board) => {
    if (!editor || !board) return;
    
    // Insert MakeBoard block
    editor.chain().focus().insertContent({
      type: 'makeBoard',
      attrs: {
        boardData: board,
      },
    }).run();
  }, [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="article-editor">
      {/* Toolbar */}
      <div className="article-editor-toolbar border-b border-gray-300 p-2 flex gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          H3
        </button>
        <div className="border-l border-gray-300 mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          type="button"
        >
          1.
        </button>
        <div className="border-l border-gray-300 mx-2" />
        {onInsertMakeBoard && (
          <MakeBoardButton 
            onInsert={(board) => {
              insertMakeBoard(board);
              onInsertMakeBoard(board);
            }}
          />
        )}
      </div>

      {/* Editor Content */}
      <div className="article-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

/**
 * MakeBoard Insert Button with Modal
 */
const MakeBoardButton = ({ onInsert }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [board, setBoard] = React.useState(null);

  const handleSave = (savedBoard) => {
    setBoard(savedBoard);
    onInsert(savedBoard);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        type="button"
      >
        🎴 Add Board
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create Bridge Board</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <BoardEditor
                onSave={handleSave}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleEditor;

