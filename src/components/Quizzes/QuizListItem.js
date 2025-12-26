import React from "react";
import MakeBoard from "../BridgeBoard/MakeBoard";
import "./QuizListItem.css";
import {
  makeDateString,
  makeBoardObjectFromString,
  getDifficultyStr,
} from "../../helpers/helpers";

const QuizListItem = ({
  date,
  body,
  quizType,
  id,
  teaser,
  teaser_board,
  title,
  router,
  clickHandler,
  a,
  difficulty,
  completed,
}) => {
  const isNewQuiz = (date) => {
    if (!date) return false;
    const quizDate = date.toDate ? date.toDate() : new Date(date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return quizDate > thirtyDaysAgo;
  };

  const showNew = isNewQuiz(date);
  const data = makeBoardObjectFromString(teaser_board);

  const quiz = {
    date,
    quizType,
    title,
    body,
    difficulty,
    teaser,
    teaser_board,
  };
  
  const diffString = getDifficultyStr(difficulty);

  return (
    <div className={`ArticleCard ${completed ? 'ArticleCard--completed' : ''}`} onClick={() => clickHandler(quiz, body)}>
      {showNew && (
        <div className="ArticleCard-new-badge">NEW</div>
      )}
      
      {completed && (
        <div className="ArticleCard-completed-badge">✓ Completed</div>
      )}

      {data && (
        <div className="ArticleCard-board">
          <MakeBoard {...data} bidding="" showVuln={false} />
        </div>
      )}

      <div className="ArticleCard-content">
        <div className="ArticleCard-meta">
          <span className="badge badge-category">{quizType}</span>
          <span className="badge badge-difficulty">{diffString}</span>
        </div>

        <h3 className="ArticleCard-title">{title}</h3>

        {teaser && (
          <p className="ArticleCard-teaser">{teaser}</p>
        )}
      </div>
    </div>
  );
};

export default QuizListItem;
