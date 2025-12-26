import React from "react";
import MakeBoard from "../BridgeBoard/MakeBoard";
import "./ArticleListItem.css";
import {
  makeDateString,
  makeBoardObjectFromString,
  getDifficultyStr,
} from "../../helpers/helpers";

const ArticleListItem = ({
  createdAt,
  body,
  category,
  difficulty,
  id,
  teaser,
  teaser_board,
  title,
  clickHandler,
  router,
  a,
}) => {
  const isLocked = !a;
  
  let articleObj = {
    createdAt,
    category,
    difficulty,
    title,
  };

  const re = /<MakeBoard .* \/>/;
  const matches = re.exec(teaser_board);
  let data;
  if (matches) data = makeBoardObjectFromString(teaser_board);
  const diffString = getDifficultyStr(difficulty);

  const isNewArticle = (createdAt) => {
    if (!createdAt) return false;
    const articleDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const showNew = isNewArticle(createdAt);

  return (
    <div className={`ArticleCard ${isLocked ? 'ArticleCard--locked' : ''}`} onClick={() => clickHandler(articleObj, body)}>
      {isLocked && (
        <div className="ArticleCard-lock">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {showNew && (
        <div className="ArticleCard-new-badge">NEW</div>
      )}

      {data && (
        <div className={`ArticleCard-board ${data.boardType === 'full' ? 'ArticleCard-board--full' : ''}`}>
          <MakeBoard {...data} bidding="" showVuln={false} isTeaser={true} />
        </div>
      )}

      <div className="ArticleCard-content">
        <div className="ArticleCard-meta">
          <span className="badge badge-category">{category}</span>
          <span className="badge badge-difficulty">{diffString}</span>
          {isLocked && (
            <span className="badge badge-locked">Premium</span>
          )}
        </div>

        <h3 className="ArticleCard-title">{title}</h3>

        {teaser && (
          <p className="ArticleCard-teaser">{teaser}</p>
        )}

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

export default ArticleListItem;
