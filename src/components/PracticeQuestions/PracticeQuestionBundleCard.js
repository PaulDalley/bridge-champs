import React from 'react';
import './PracticeQuestionBundleCard.css';
import {
  getLevelStr,
} from '../../helpers/helpers';

const PracticeQuestionBundleCard = ({
  id,
  title,
  teaser,
  difficulty,
  articleNumber,
  questionCount,
  clickHandler,
  a,
  subscriptionActive,
}) => {
  const isAdmin = a === true;
  const isLocked = !isAdmin && !subscriptionActive;

  const handleClick = () => {
    if (clickHandler) {
      clickHandler(id);
    }
  };

  const diffString = getLevelStr(difficulty);

  return (
    <div className={`PracticeQuestionBundleCard ${isLocked ? 'PracticeQuestionBundleCard--locked' : ''}`} onClick={handleClick}>
      {/* Lock Icon for Premium Content */}
      {isLocked && (
        <div className="PracticeQuestionBundleCard-lock">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Practice Questions Badge */}
      <div className="PracticeQuestionBundleCard-badge">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.2rem', height: '1.2rem' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>Practice Questions</span>
      </div>

      {/* Content */}
      <div className="PracticeQuestionBundleCard-content">
        {/* Badges */}
        <div className="PracticeQuestionBundleCard-meta">
          <span className="badge badge-number">
            #{articleNumber}
          </span>
          <span className="badge badge-difficulty">{diffString}</span>
          {questionCount > 0 && (
            <span className="badge badge-count">
              {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
            </span>
          )}
          {isLocked && (
            <span className="badge badge-locked">
              Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="PracticeQuestionBundleCard-title">{title}</h3>

        {/* Teaser Text */}
        {teaser && (
          <p className="PracticeQuestionBundleCard-teaser">{teaser}</p>
        )}

        {/* Locked Overlay */}
        {isLocked && (
          <div className="PracticeQuestionBundleCard-locked-overlay">
            <div className="PracticeQuestionBundleCard-locked-cta">
              <button className="btn btn-secondary btn-small">
                subscribe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeQuestionBundleCard;



