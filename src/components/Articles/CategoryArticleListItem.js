import React from 'react';
import MakeBoard from '../BridgeBoard/MakeBoard';
import './CategoryArticleListItem.css';
import {
  makeDateString,
  makeBoardObjectFromString,
  getLevelStr,
} from '../../helpers/helpers';

const CategoryArticleListItem = ({
  createdAt,
  body,
  category,
  difficulty,
  articleNumber,
  id,
  teaser,
  teaser_board,
  title,
  clickHandler,
  a,
  articleType,
}) => {
  const isLocked = !a;

  const handleClick = () => {
    if (clickHandler) {
      const articleObj = {
        createdAt,
        body,
        category,
        difficulty,
        articleNumber,
        id,
        teaser,
        teaser_board,
        title,
      };
      clickHandler(articleObj, body, articleType);
    }
  };

  const isNewArticle = (createdAt) => {
    if (!createdAt) return false;
    const articleDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const showNew = isNewArticle(createdAt);
  const diffString = getLevelStr(difficulty);

  // Parse bridge board data
  const re = /<MakeBoard .* \/>/;
  const matches = re.exec(teaser_board);
  let boardData;
  if (matches) {
    boardData = makeBoardObjectFromString(teaser_board);
  }

  return (
    <div className={`ArticleCard ${isLocked ? 'ArticleCard--locked' : ''}`} onClick={handleClick}>
      {/* Lock Icon for Premium Content */}
      {isLocked && (
        <div className="ArticleCard-lock">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* New Badge */}
      {showNew && (
        <div className="ArticleCard-new-badge">
          NEW
        </div>
      )}

      {/* Bridge Board Display */}
      {boardData && (
        <div className={`ArticleCard-board ${boardData.boardType === 'full' ? 'ArticleCard-board--full' : ''}`}>
          <MakeBoard {...boardData} bidding="" showVuln={false} isTeaser={true} />
        </div>
      )}

      {/* Article Content */}
      <div className="ArticleCard-content">
        {/* Badges */}
        <div className="ArticleCard-meta">
          <span className="badge badge-difficulty">
            {diffString}
          </span>
          <span className="badge badge-number">
            #{articleNumber}
          </span>
          {isLocked && (
            <span className="badge badge-locked">
              Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="ArticleCard-title">{title}</h3>

        {/* Teaser Text */}
        {teaser && (
          <p className="ArticleCard-teaser">{teaser}</p>
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
  );
};

export default CategoryArticleListItem;
