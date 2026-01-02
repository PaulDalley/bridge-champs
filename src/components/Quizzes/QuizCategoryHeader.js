/**
 * Quiz Category Header Component
 * Displays category name with collapsible functionality
 * Supports admin inline editing
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateCategoryName } from '../../services/quizCategoryService';
import { Icon } from 'react-materialize';
import './QuizCategoryHeader.css';

const QuizCategoryHeader = ({ categoryId, categoryName, quizCount, isExpanded, onToggle, onUpdate }) => {
  const isAdmin = useSelector((state) => state.auth.a === true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(categoryName);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent toggle when clicking edit
    setEditText(categoryName);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(categoryName);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent toggle when clicking save
    if (editText.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateCategoryName(categoryId, editText.trim());
      setIsEditing(false);
      // Notify parent to refresh category names
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving category name:', error);
      alert('Error saving category name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      className={`QuizCategoryHeader ${isExpanded ? 'QuizCategoryHeader-expanded' : ''}`}
      onClick={onToggle}
    >
      <div className="QuizCategoryHeader-content">
        <div className="QuizCategoryHeader-left">
          <Icon className="QuizCategoryHeader-icon">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </Icon>
          {isEditing ? (
            <input
              type="text"
              className="QuizCategoryHeader-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              disabled={isSaving}
            />
          ) : (
            <h2 className="QuizCategoryHeader-text">
              {categoryName}
              <span className="QuizCategoryHeader-count"> ({quizCount})</span>
            </h2>
          )}
        </div>
        {isAdmin && !isEditing && (
          <button
            className="QuizCategoryHeader-edit-btn"
            onClick={handleEdit}
            title="Edit category name"
          >
            ✎ Edit
          </button>
        )}
      </div>
      {isEditing && (
        <div className="QuizCategoryHeader-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="QuizCategoryHeader-save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="QuizCategoryHeader-cancel-btn"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCategoryHeader;

