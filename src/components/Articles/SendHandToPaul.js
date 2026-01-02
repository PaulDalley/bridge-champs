/**
 * Send Hand to Paul Component
 * Allows users to send bridge hands to Paul via form with text input and file upload
 */

import React, { useState } from 'react';
import { Button } from 'react-materialize';
import { firebase } from '../../firebase/config';
import './SendHandToPaul.css';

const SendHandToPaul = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [handText, setHandText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!handText.trim() && !uploadedFile) {
      alert('Please provide either hand text or upload a file.');
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrl = null;
      
      // Upload file to Firebase Storage if provided
      if (uploadedFile) {
        try {
          // Check if firebase.storage is available
          if (firebase.storage) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`hand-submissions/${Date.now()}-${uploadedFile.name}`);
            await fileRef.put(uploadedFile);
            fileUrl = await fileRef.getDownloadURL();
          } else {
            console.warn('Firebase Storage is not available. File upload skipped.');
          }
        } catch (storageError) {
          console.error('Error uploading file:', storageError);
          // Continue without file URL if upload fails
        }
      }

      const submissionData = {
        handText: handText.trim() || '',
        fileName: uploadedFile ? fileName : null,
        fileUrl: fileUrl || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'handSubmission'
      };

      await firebase.firestore().collection('handSubmissions').add(submissionData);
      
      setSubmitted(true);
      setHandText('');
      setUploadedFile(null);
      setFileName('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting hand:', error);
      alert('Error submitting hand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="SendHandToPaul SendHandToPaul-submitted">
        <div className="SendHandToPaul-success">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '3rem', height: '3rem', color: '#4caf50' }}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <h3>Thank you!</h3>
          <p>Your hand has been sent to Paul.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="SendHandToPaul">
      {!isOpen ? (
        <button
          className="SendHandToPaul-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open send hand form"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '2rem', height: '2rem' }}>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>Send a Hand to Paul</span>
        </button>
      ) : (
        <div className="SendHandToPaul-card">
          <div className="SendHandToPaul-header">
            <h3>Send a Hand to Paul</h3>
            <p className="SendHandToPaul-intro">
              Please feel free to upload the hand record or to just type the hand, for example:
              <br />
              <br />
              <code>
                AK108<br />
                K43<br />
                etc
              </code>
            </p>
            <button
              className="SendHandToPaul-close"
              onClick={() => {
                setIsOpen(false);
                setHandText('');
                setUploadedFile(null);
                setFileName('');
              }}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="SendHandToPaul-field">
              <label htmlFor="hand-text" className="SendHandToPaul-label">
                Type the Hand (optional if uploading file)
              </label>
              <textarea
                id="hand-text"
                name="handText"
                value={handText}
                onChange={(e) => setHandText(e.target.value)}
                rows="8"
                className="SendHandToPaul-textarea"
                placeholder="AK108&#10;K43&#10;QJ92&#10;765"
              />
            </div>

            <div className="SendHandToPaul-field">
              <label htmlFor="hand-file" className="SendHandToPaul-label">
                Or Upload Hand Record File (optional)
              </label>
              <div className="SendHandToPaul-file-upload">
                <input
                  type="file"
                  id="hand-file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pbn,.lin,.txt,.doc,.docx,.pdf"
                  className="SendHandToPaul-file-input"
                />
                <label htmlFor="hand-file" className="SendHandToPaul-file-label">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                  </svg>
                  <span>{fileName || 'Choose file or drag it here'}</span>
                </label>
                {fileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      setFileName('');
                      document.getElementById('hand-file').value = '';
                    }}
                    className="SendHandToPaul-remove-file"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="SendHandToPaul-actions">
              <Button
                type="submit"
                waves="light"
                disabled={isSubmitting}
                className="SendHandToPaul-submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Send Hand'}
              </Button>
              <Button
                type="button"
                waves="light"
                flat
                onClick={() => {
                  setIsOpen(false);
                  setHandText('');
                  setUploadedFile(null);
                  setFileName('');
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

export default SendHandToPaul;

