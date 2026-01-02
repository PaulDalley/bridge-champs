/**
 * Video Card Component
 * Displays video-only content in category article lists
 * Styled to match article cards
 */

import React, { useState, useEffect } from 'react';
import './VideoCard.css';
import './CategoryArticleListItem.css'; // Import shared article card styles

const VideoCard = ({
  id,
  title,
  url,
  description,
  createdAt,
  difficulty,
  a,
  subscriptionActive,
  onDelete,
}) => {
  const isAdmin = a === true;
  const isLocked = !isAdmin && !subscriptionActive;
  const [showModal, setShowModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const getYouTubeThumbnail = (videoUrl) => {
    let videoId = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      videoId = videoUrl.split('watch?v=')[1].split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoUrl.includes('youtube.com/embed/')) {
      videoId = videoUrl.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const handleClick = () => {
    if (isLocked) {
      return; // Don't open modal if locked
    }
    setShowModal(true);
  };

  const thumbnail = getYouTubeThumbnail(url);

  return (
    <>
      <div className={`VideoCard ArticleCard ${isLocked ? 'ArticleCard--locked' : ''}`} onClick={handleClick}>
        {/* Lock Icon for Premium Content */}
        {isLocked && (
          <div className="ArticleCard-lock">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Video Badge */}
        <div className="VideoCard-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.6rem', height: '1.6rem' }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Video</span>
        </div>

        {/* Video Thumbnail */}
        <div className="VideoCard-thumbnail">
          <img src={thumbnail} alt={title} />
          <div className="VideoCard-play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Video Content */}
        <div className="ArticleCard-content">
          <div className="ArticleCard-meta">
            {difficulty && (
              <span className="badge badge-difficulty">
                Level {difficulty}
              </span>
            )}
            {isLocked && (
              <span className="badge badge-locked">
                Premium
              </span>
            )}
          </div>

          <h3 className="ArticleCard-title">{title}</h3>

          {description && (
            <p className="ArticleCard-teaser">{description}</p>
          )}

          {/* Admin Delete Button */}
          {isAdmin && onDelete && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
                    onDelete(id);
                  }
                }}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  fontWeight: 600
                }}
              >
                Delete Video
              </button>
            </div>
          )}

          {/* Locked Overlay */}
          {isLocked && (
            <div className="ArticleCard-locked-overlay">
              <div className="ArticleCard-locked-cta">
                <button className="btn btn-secondary btn-small">
                  subscribe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Video Player Modal */}
      {showModal && (
        <div className="VideoCard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="VideoCard-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="VideoCard-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close video"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="VideoCard-modal-content">
              <h2 className="VideoCard-modal-title">{title}</h2>
              <div className="VideoCard-modal-video-wrapper">
                <iframe
                  className="VideoCard-modal-video"
                  src={url}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {description && (
                <p className="VideoCard-modal-description">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;

