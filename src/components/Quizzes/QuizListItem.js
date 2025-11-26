import React from "react";
import { CardPanel } from "react-materialize";
import MakeBoard from "../BridgeBoard/MakeBoard";
import "./QuizListItem.css";
import { Button, Icon } from "react-materialize";
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
  let dateStr = makeDateString(date);
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
  const diffClass = "ArticlesListItem-difficulty-" + difficulty;
  let completedStyles = "";

  // console.log(title, completed, id);

  if (completed) {
    // console.log("This quiz is completed");
    // console.log(title);
    completedStyles = "QuizListItem-container-completed";
  }

  return (
    <div className={`ArticlesListItem-div_wrapper`}>
      <CardPanel
        key={id}
        onClick={() => clickHandler(quiz, body)}
        className={`ArticlesListItem-container ${
          completed ? "" : "grey lighten-4"
        } black-text ${completedStyles}`}
      >
        <div className="ArticleListItem-created_at">{dateStr}</div>
        {/*<div className="QuizListItem-quizType">{quizType}</div>*/}
        <div className="ArticleListItem-category">{quizType}</div>
        <div className={`ArticleListItem-difficulty ${diffClass}`}>
          {diffString}
        </div>
        {completed && (
          <div className="ArticleListItem-category DisplayQuiz-completed">
            Completed
          </div>
        )}

        <br />
        <div className="ArticleListItem-title">{title}</div>
        <div>{teaser}</div>
        <br />
        <div className="ArticleListItem-teaser_board">
          <MakeBoard {...data} bidding="" showVuln={false} />
        </div>
      </CardPanel>
      {a && (
        <Button
          onClick={(e) => router.push(`/edit/quiz/${id}`)}
          floating
          className="orange darken-5"
          waves="light"
          icon={<Icon>mode_edit</Icon>}
          style={{
            position: "absolute",
            right: "2.5rem",
            bottom: "3rem",
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
};
export default QuizListItem;
