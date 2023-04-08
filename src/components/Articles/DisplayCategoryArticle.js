import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getArticle,
  getArticleMetadata,
} from "../../store/actions/categoryArticlesActions";
import "./DisplayArticle.css";
import "./ArticleListItem.css";

import {
  parseDocumentIntoJSX,
  makeDateString,
  findArticleById,
  makeBoardObjectFromString,
  getDifficultyStr,
} from "../../helpers/helpers";
import MakeBoard from "../../components/BridgeBoard/MakeBoard";
import { Col, ProgressBar } from "react-materialize";
import Comments from "../Comments/Comments";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// export default connect(
//     (state) => ({
//       uid: state.auth.uid,
//       username: state.auth.username,
//       displayName: state.auth.displayName,
//       photoURL: state.auth.photoURL,
//       articles: state.articles.articles,
//       article: state.articles.article,
//       articleMetadata: state.articles.currentArticle,
//     }),
//     { getArticle, getArticleMetadata }
//   )(DisplayArticle);

const DisplayCategoryArticle = ({
  location,
  history,
  articleType,
  bodyRef,
  match,
  articleNumber,
  difficulty,
}) => {
  const uid = useSelector((state) => state.auth.uid);
  const username = useSelector((state) => state.auth.username);
  const displayName = useSelector((state) => state.auth.displayName);
  const photoURL = useSelector((state) => state.auth.photoURL);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const article = useSelector((state) => state.categoryArticles?.article);
  const articleMetadata = useSelector(
    (state) => state.categoryArticles?.currentArticle
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const articleId = match.params.id;
    dispatch(getArticle(articleId, history, bodyRef));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const articleId = match.params.id;
  let articleText;

  if (article) {
    articleText = article?.[articleId]?.text;
  }

  let useMetaData = undefined;

  if (articleMetadata !== undefined) {
    useMetaData = articleMetadata;
  } else {
    useMetaData = findArticleById(articles, articleId);
  }
  if (!useMetaData) {
    dispatch(getArticleMetadata(articleId, articleType));
  }

  let articleDataArray = [];

  if (articleText) {
    articleDataArray = parseDocumentIntoJSX(articleText);
  }

  // console.log(
  //   `--- Trying to display article with id: ${articleId} and bodyRef: ${bodyRef} ---`
  // );
  // console.log(articles);
  // console.log(article);
  // console.log(articleText);
  // console.log("-- metadata generated in component --");
  // console.log(useMetaData);
  // console.log("--- metadata from store.categoryArticles.currentArticle ---");
  // console.log(articleMetadata);
  // console.log(articleDataArray);
  // console.log("--- DIFFICULTY AND ARTICLE LEVEL INFORMATION ---");
  // console.log(articleMetadata?.articleNumber);
  // console.log(articleMetadata?.difficulty);

  if (!article) {
    return (
      <div className="DisplayArticle-container">
        <Col s={12}>
          <ProgressBar />
        </Col>
      </div>
    );
  }

  return (
    <div className="DisplayArticle-container">
      {articleMetadata && ( // articleMetadata
        <div>
          <h3 className="DisplayArticle-title">{articleMetadata.title}</h3>
          <div className="DisplayArticle-category">
            Article {articleMetadata.difficulty}
          </div>
          <div
            // className={`DisplayArticle-difficulty ArticlesListItem-difficulty-${articleMetadata.difficulty}`}
            className={`DisplayArticle-difficulty ArticlesListItem-difficulty-general`}
          >
            Level {articleMetadata.articleNumber}
          </div>
          <div className="DisplayArticle-createdAt">
            {makeDateString(articleMetadata.createdAt)}
          </div>
        </div>
      )}
      {articleDataArray}

      {article && (
        <Comments
          uid={uid}
          username={username}
          displayName={displayName}
          photoURL={photoURL}
          parentId={article.id}
        />
      )}
    </div>
  );
};

export default DisplayCategoryArticle;
