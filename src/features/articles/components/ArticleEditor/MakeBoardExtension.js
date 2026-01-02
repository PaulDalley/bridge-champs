import { Node, mergeAttributes } from '@tiptap/core';

/**
 * TipTap Extension for MakeBoard Blocks
 * 
 * This allows MakeBoard to be a first-class block type in the editor
 * No more tag stripping!
 */
export const MakeBoardExtension = Node.create({
  name: 'makeBoard',
  
  group: 'block',
  
  atom: true,
  
  addAttributes() {
    return {
      boardData: {
        default: null,
        parseHTML: element => {
          const data = element.getAttribute('data-board');
          return data ? JSON.parse(data) : null;
        },
        renderHTML: attributes => {
          if (!attributes.boardData) {
            return {};
          }
          return {
            'data-board': JSON.stringify(attributes.boardData),
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'make-board',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['make-board', mergeAttributes(HTMLAttributes), 0];
  },
  
  addNodeView() {
    return ({ node }) => {
      const board = node.attrs.boardData;
      
      if (!board) {
        return document.createElement('div');
      }
      
      const container = document.createElement('div');
      container.className = 'makeboard-block p-4 border border-gray-300 rounded-lg bg-gray-50';
      
      // Import and render BoardDisplay component
      // For now, show a simple preview
      container.innerHTML = `
        <div class="mb-2 font-semibold text-gray-800">Bridge Board (${board.type})</div>
        <div class="text-sm text-gray-600">
          ${board.position ? `Position: ${board.position}` : 'Full Board'} | 
          Dealer: ${board.dealer} | 
          Vul: ${board.vulnerability}
        </div>
      `;
      
      return {
        dom: container,
      };
    };
  },
});


