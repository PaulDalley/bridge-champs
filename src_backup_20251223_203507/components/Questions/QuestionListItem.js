import React from "react";
import { CardPanel, Button, Icon } from "react-materialize";
import MakeBoard from "../BridgeBoard/MakeBoard";
import {
  makeDateString,
  makeBoardObjectFromString,
  getDifficultyStr,
} from "../../helpers/helpers";
import Vote from "../../containers/Vote";

const QuestionListItem = ({
  createdAt,
  body,
  category,
  difficulty,
  id,
  text,
  teaser_board,
  title,
  clickHandler,
  router,
  a,
}) => {
  let diffString;
  let dateStr = makeDateString(createdAt);
  let articleObj = {
    createdAt,
    category,
    difficulty,
    title,
  };
  // console.log(title);
  const re = /<MakeBoard .* \/>/;
  const matches = re.exec(teaser_board);
  let data;
  if (matches) data = makeBoardObjectFromString(teaser_board);
  diffString = getDifficultyStr(difficulty);

  // console.log(diffString);

  const diffClass = "ArticlesListItem-difficulty-" + difficulty;

  return (
    <div className="ArticlesListItem-div_wrapper">
      <CardPanel
        key={id}
        // onClick={() => router(`/article/${body}`)}
        onClick={() => clickHandler(articleObj, body)}
        className="ArticlesListItem-container grey lighten-4 black-text"
      >
        <Vote id={id} />
        <br />

        <div className="ArticleListItem-created_at">{dateStr}</div>
        <div className="ArticleListItem-category">{category}</div>
        <div className={`ArticleListItem-difficulty ${diffClass}`}>
          {diffString}
        </div>
        <br />
        <div className="ArticleListItem-title">{title}</div>
        <div className="ArticleListItem-teaser">{text}</div>
        <br />
        <br />

        {data && (
          <div className="ArticleListItem-teaser_board">
            <MakeBoard {...data} bidding="" showVuln={false} isTeaser={true} />
          </div>
        )}
      </CardPanel>
      <div
        style={{
          position: "absolute",
          right: "2.5rem",
          bottom: "3rem",
          zIndex: 5,
          color: "#696969",
        }}
      ></div>

      {a && (
        <Button
          onClick={(e) => router.push(`/edit/article/${id}`)}
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

export default QuestionListItem;
