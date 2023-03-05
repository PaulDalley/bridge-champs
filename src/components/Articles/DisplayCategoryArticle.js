import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getArticle,
  getArticleMetadata,
} from "../../store/actions/categoryArticlesActions";
import "./DisplayArticle.css";
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

const DisplayCategoryArticle = ({ location, history, articleType, match }) => {
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
    dispatch(getArticle(articleId, history, articleType));
  }, []);

  const articleId = match.params.id;
  let articleText;

  if (article) {
    articleText = article.text;
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
      {articleMetadata && (
        <div>
          <h3 className="DisplayArticle-title">{articleMetadata.title}</h3>
          <div className="DisplayArticle-category">
            {articleMetadata.category}
          </div>
          <div
            className={`DisplayArticle-difficulty ArticlesListItem-difficulty-${articleMetadata.difficulty}`}
          >
            {getDifficultyStr(articleMetadata.difficulty)}
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
