/**
 * Feedback Form Component
 * Collects user feedback on article content
 */

import React, { useState } from 'react';
import { Button, Row, Col, Card } from 'react-materialize';
import { firebase } from '../../firebase/config';
import './FeedbackForm.css';

const FeedbackForm = ({ articleId, articleType, articleTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [feedback, setFeedback] = useState({
    easeOfUnderstanding: null, // 1-3 (Easy to Hard)
    contentHelpful: null, // 1-3
    contentPresentedWell: null, // 1-3
    comments: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value === '' ? null : Number(value)
    }));
  };

  const handleCommentsChange = (e) => {
    setFeedback(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least some feedback is provided
    if (!feedback.easeOfUnderstanding && !feedback.contentHelpful && 
        !feedback.contentPresentedWell && !feedback.comments.trim()) {
      alert('Please provide at least some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        articleId: articleId || 'unknown',
        articleType: articleType || 'unknown',
        articleTitle: articleTitle || 'Unknown Article',
        easeOfUnderstanding: feedback.easeOfUnderstanding,
        contentHelpful: feedback.contentHelpful,
        contentPresentedWell: feedback.contentPresentedWell,
        comments: feedback.comments.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      await firebase.firestore().collection('articleFeedback').add(feedbackData);
      
      setSubmitted(true);
      setFeedback({
        easeOfUnderstanding: null,
        contentHelpful: null,
        contentPresentedWell: null,
        comments: ''
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScaleQuestion = (label, name, value) => {
    return (
      <div className="FeedbackForm-question">
        <label className="FeedbackForm-label">{label}</label>
        <div className="FeedbackForm-scale">
          {[1, 2, 3].map((num) => {
            let scaleLabel = '';
            if (name === 'easeOfUnderstanding') {
              scaleLabel = num === 1 ? 'Easy' : num === 2 ? 'Medium' : 'Hard';
            } else {
              // For "helpful" and "presented well" - Yes/No scale
              scaleLabel = num === 1 ? 'Yes' : num === 2 ? 'Somewhat' : 'No';
            }
            
            return (
              <label key={num} className="FeedbackForm-scale-option">
                <input
                  type="radio"
                  name={name}
                  value={num}
                  checked={value === num}
                  onChange={handleInputChange}
                />
                <span className="FeedbackForm-scale-number">{num}</span>
                <span className="FeedbackForm-scale-label">{scaleLabel}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="FeedbackForm FeedbackForm-submitted">
        <div className="FeedbackForm-success">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '4rem', height: '4rem', color: '#4caf50' }}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <h3>Thank you for your feedback!</h3>
          <p>Your input helps us improve our content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="FeedbackForm">
      {!isOpen ? (
        <button
          className="FeedbackForm-toggle"
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
        <Card className="FeedbackForm-card">
          <div className="FeedbackForm-header">
            <h3>Help Us Improve</h3>
            <p>Your feedback helps us create better content</p>
            <button
              className="FeedbackForm-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {renderScaleQuestion(
              'Is this easy to understand?',
              'easeOfUnderstanding',
              feedback.easeOfUnderstanding
            )}

            {renderScaleQuestion(
              'Do you find the content helpful?',
              'contentHelpful',
              feedback.contentHelpful
            )}

            {renderScaleQuestion(
              'Is the content presented well?',
              'contentPresentedWell',
              feedback.contentPresentedWell
            )}

            <div className="FeedbackForm-question">
              <label htmlFor="comments" className="FeedbackForm-label">
                Any comments? What do you find confusing? What would you like to see more of?
              </label>
              <textarea
                id="comments"
                name="comments"
                value={feedback.comments}
                onChange={handleCommentsChange}
                rows="5"
                className="FeedbackForm-textarea"
                placeholder="Share your thoughts, questions, or suggestions..."
              />
            </div>

            <div className="FeedbackForm-actions">
              <Button
                type="submit"
                waves="light"
                disabled={isSubmitting}
                className="FeedbackForm-submit-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                type="button"
                waves="light"
                flat
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default FeedbackForm;

