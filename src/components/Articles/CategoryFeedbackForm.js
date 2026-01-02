/**
 * Category Feedback Form Component
 * Collects user feedback on category pages (Declarer Play, Bidding, Defence)
 */

import React, { useState } from 'react';
import { Button } from 'react-materialize';
import { firebase } from '../../firebase/config';
import './CategoryFeedbackForm.css';

const CategoryFeedbackForm = ({ category, categoryName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      alert('Please provide some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        category: category || 'unknown',
        categoryName: categoryName || 'Unknown Category',
        feedback: feedback.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'category' // Distinguish from article feedback
      };

      await firebase.firestore().collection('categoryFeedback').add(feedbackData);
      
      setSubmitted(true);
      setFeedback('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="CategoryFeedbackForm CategoryFeedbackForm-submitted">
        <div className="CategoryFeedbackForm-success">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '3rem', height: '3rem', color: '#4caf50' }}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <h3>Thank you for your feedback!</h3>
          <p>Your input helps us improve our content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="CategoryFeedbackForm">
      {!isOpen ? (
        <button
          className="CategoryFeedbackForm-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open feedback form"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2rem', height: '2rem' }}>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
          <span>Share Your Feedback</span>
        </button>
      ) : (
        <div className="CategoryFeedbackForm-card">
          <div className="CategoryFeedbackForm-header">
            <h3>Your Feedback Matters</h3>
            <p className="CategoryFeedbackForm-intro">
              Your bridge journey means everything to us.<br />
              Please tell us what you find confusing or what works well for you. Your feedback is very important to me.
            </p>
            <button
              className="CategoryFeedbackForm-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="CategoryFeedbackForm-question">
              <label htmlFor="category-feedback" className="CategoryFeedbackForm-label">
                What do you find confusing? What works well? Any suggestions?
              </label>
              <textarea
                id="category-feedback"
                name="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="6"
                className="CategoryFeedbackForm-textarea"
                placeholder="Share your thoughts, questions, or suggestions about this category..."
              />
            </div>

            <div className="CategoryFeedbackForm-actions">
              <Button
                type="submit"
                waves="light"
                disabled={isSubmitting}
                className="CategoryFeedbackForm-submit-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                type="button"
                waves="light"
                flat
                onClick={() => {
                  setIsOpen(false);
                  setFeedback('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryFeedbackForm;

