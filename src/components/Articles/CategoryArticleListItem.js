import React from "react";
import { CardPanel, Button, Icon } from "react-materialize";
import MakeBoard from "../BridgeBoard/MakeBoard";
import "./ArticleListItem.css";
import {
  makeDateString,
  makeBoardObjectFromString,
  getDifficultyStr,
  getLevelStr,
} from "../../helpers/helpers";

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
  router,
  a,
  articleType,
}) => {
  let diffString;
  console.log("--- Creating date string with date ---");
  console.log(createdAt);
  console.log(createdAt?.toDate());
  let dateStr = makeDateString(createdAt);
  let articleObj = {
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

  const re = /<MakeBoard .* \/>/;
  const matches = re.exec(teaser_board);
  let data;
  if (matches) data = makeBoardObjectFromString(teaser_board);
  diffString = getLevelStr(difficulty);

  const diffClass = "ArticlesListItem-difficulty-" + "general"; // + difficulty; // beg, int, adv, general

  return (
    <div className="ArticlesListItem-div_wrapper">
      <CardPanel
        key={id}
        // onClick={() => router(`/article/${body}`)}
        onClick={() => clickHandler(articleObj, body)}
        className="ArticlesListItem-container grey lighten-4 black-text"
      >
        <div className="ArticleListItem-created_at">{dateStr}</div>
        <div className="ArticleListItem-category">Article {articleNumber}</div>
        <div className={`ArticleListItem-difficulty ${diffClass}`}>
          {diffString}
        </div>
        <br />
        <div className="ArticleListItem-title">{title}</div>
        <div className="ArticleListItem-teaser">{teaser}</div>
        <br />
        {data && data.boardType !== "full" && (
          <div className="ArticleListItem-teaser_board">
            <MakeBoard {...data} bidding="" showVuln={false} isTeaser={true} />
          </div>
        )}
        {data && data.boardType === "full" && (
          <div className="ArticleListItem-teaser_board ArticleListItem-teaser_board_full">
            <MakeBoard {...data} bidding="" showVuln={false} isTeaser={true} />
          </div>
        )}
      </CardPanel>

      {a && (
        <Button
          onClick={(e) => router.push(`/edit/${articleType}/${id}`)}
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
export default CategoryArticleListItem;
