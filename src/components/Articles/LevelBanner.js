/**
 * Level Banner Component
 * Displays banner text for article level groupings
 * Supports admin inline editing
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateBannerText } from '../../services/categoryBannerService';
import CategoryFeedbackForm from './CategoryFeedbackForm';
import SendHandToPaul from './SendHandToPaul';
import './LevelBanner.css';

const LevelBanner = ({ text, level, category, onUpdate, categoryName }) => {
  const isAdmin = useSelector((state) => state.auth.a === true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditText(text);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (editText.trim() === '') {
      alert('Banner text cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateBannerText(category, level, editText.trim());
      setIsEditing(false);
      // Notify parent to refresh banner texts
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving banner text:', error);
      alert('Error saving banner text. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`LevelBanner ${isEditing ? 'LevelBanner-editing' : ''}`}>
      <div className="LevelBanner-content">
        {isAdmin && !isEditing && (
          <button
            className="LevelBanner-edit-btn"
            onClick={handleEdit}
            title="Edit banner text"
          >
            ✎ Edit
          </button>
        )}
        <h2 className="LevelBanner-text">{text}</h2>
        {isEditing && (
          <>
            <input
              type="text"
              className="LevelBanner-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              disabled={isSaving}
            />
            <div className="LevelBanner-actions">
              <button
                className="LevelBanner-save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="LevelBanner-cancel-btn"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      {/* Feedback Buttons - Only show on first banner to avoid duplication */}
      {level === '1' && (
        <div className="LevelBanner-buttons">
          <CategoryFeedbackForm 
            category={category} 
            categoryName={categoryName}
          />
          <SendHandToPaul />
        </div>
      )}
    </div>
  );
};

export default LevelBanner;

