import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { firebase } from '../../firebase/config';
import './WelcomeVideo.css';

const WelcomeVideo = ({ a }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch welcome video URL from Firestore
    const fetchVideoUrl = async () => {
      try {
        const doc = await firebase.firestore().collection('siteSettings').doc('welcomeVideo').get();
        if (doc.exists) {
          const data = doc.data();
          setVideoUrl(data.url || '');
          setEditUrl(data.url || '');
        }
      } catch (error) {
        console.error('Error fetching welcome video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, []);

  const handleSave = async () => {
    try {
      await firebase.firestore().collection('siteSettings').doc('welcomeVideo').set({
        url: editUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setVideoUrl(editUrl);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving welcome video:', error);
      alert('Error saving video URL. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditUrl(videoUrl);
    setIsEditing(false);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed URL
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (loading) {
    return null;
  }

  // Admin edit mode
  if (a === true && isEditing) {
    return (
      <div className="WelcomeVideo WelcomeVideo--editing">
        <div className="WelcomeVideo-admin-controls">
          <input
            type="text"
            className="WelcomeVideo-url-input"
            placeholder="Enter YouTube URL"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
          />
          <button className="btn btn-small green" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-small" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        {editUrl && (
          <div className="WelcomeVideo-preview">
            <iframe
              src={getYouTubeEmbedUrl(editUrl)}
              title="Welcome Video Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }

  // Display mode
  if (!videoUrl) {
    // Show admin prompt if no video is set
    if (a === true) {
      return (
        <div className="WelcomeVideo WelcomeVideo--empty">
          <p>No welcome video set.</p>
          <button className="btn btn-small" onClick={() => setIsEditing(true)}>
            Add Welcome Video
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="WelcomeVideo">
      {a === true && (
        <button
          className="WelcomeVideo-edit-btn"
          onClick={() => setIsEditing(true)}
          title="Edit welcome video"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      )}
      <div className="WelcomeVideo-container">
        <iframe
          src={embedUrl}
          title="Welcome to Bridge Champions"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="WelcomeVideo-iframe"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  a: state.auth.a,
});

export default connect(mapStateToProps)(WelcomeVideo);

