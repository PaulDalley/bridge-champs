import React from "react";
import { CardPanel, Button, Icon } from "react-materialize";
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
  let diffString;
  let dateStr = makeDateString(createdAt);
  let articleObj = {
    createdAt,
    category,
    difficulty,
    title,
  };

  //   console.log(" --- Making date string ---");
  //   console.log(createdAt);
  //   console.log(new Date(createdAt.seconds));
  //   console.log(makeDateString(new Date(createdAt.seconds)));
  //   console.log(dateStr);

  // '<MakeBoard boardType="single" position="North" North="*S-AJ76*H-J72*D-J92*C-A42" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Vul North/South" dealer="West" bidding="" />',
  // let board = teaser_board.split(" ");
  // board[7] += " " + board[8];
  // board = board.slice(1, -1);
  // // console.log(board);
  // const data = {};
  // board.forEach((each, idx) => {
  //     if (idx !== 7) {
  //         let [key, value] = each.split("=");
  //         data[key] = value.slice(1, -1);
  //     }
  // });
  // data["showVuln"] = false;
  // // console.log(data);

  const re = /<MakeBoard .* \/>/;
  const matches = re.exec(teaser_board);
  let data;
  if (matches) data = makeBoardObjectFromString(teaser_board);
  diffString = getDifficultyStr(difficulty);

  // console.log(diffString);

  const diffClass = "ArticlesListItem-difficulty-" + difficulty;

  const isNewArticle = (createdAt) => {
    if (!createdAt) return false;
    const articleDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const showNew = isNewArticle(createdAt);

  // console.log(teaser_board);
  // const teaserBoardHtml = '<div>test <br/>' + teaser_board + ' test</div>'
  // const teaserBoardHtml = '<div> <h1> WHATEVER </h1> </div>';
  // console.log(teaserBoardHtml);
  // console.log(data);

  // if (activeClassReference && !(activeClassReference.activeClass === 'articles')) {
  //     clickHandler = (x, y) => {};
  // }

  // console.log(clickHandler);

  return (
    <div className="ArticlesListItem-div_wrapper">
      <CardPanel
        key={id}
        // onClick={() => router(`/article/${body}`)}
        onClick={() => clickHandler(articleObj, body)}
        className="ArticlesListItem-container grey lighten-4 black-text"
      >
        <div className="ArticleListItem-created_at">{showNew ? <span className="ArticleListItem-new-badge">NEW</span> : null}</div>
        <div className="ArticleListItem-category">{category}</div>
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

        {/*<div>{teaser_board}</div>*/}
        {/*<div dangerouslySetInnerHTML={{__html: teaserBoardHtml }}></div>*/}
        {/*<div dangerouslySetInnerHTML={{ __html: `<div>HELLO THERE: <br/> ${teaser_board}</div>`}} />*/}
        {/*<MakeBoard boardType="single" position="North" North="*S-AJ76*H-J72*D-J92*C-A42" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Vul North/South" dealer="West" bidding="" />*/}
        {/*<Markup content="This string <h1>contains</h1> HTML." />*/}
        {/*<Markup content={teaser_board} />*/}
      </CardPanel>
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
export default ArticleListItem;
