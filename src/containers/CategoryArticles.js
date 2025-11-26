import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import {
  getArticles,
  getArticlesChunk,
  getArticleCount,
  setCurrentArticle,
} from "../store/actions/categoryArticlesActions";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import {
  filterArticles,
  filterCategoryArticles,
  sortCategoryArticlesByLevelAndArticleNumber,
} from "../helpers/helpers";
// import ArticleListItem from "../components/Articles/ArticleListItem";
import CategoryArticleListItem from "../components/Articles/CategoryArticleListItem";
import "./Articles.css";
import Filters from "./Filters";
import Pagination from "../components/Pagination";
import FiltersCategoryArticles from "./FiltersCategoryArticles";

// const mapStateToProps = (state, ownProps) => ({
//     articles: filterArticles(state.articles.articles, state.filters),
//     fetchedByCategory: state.articles.fetchedByCategory,
//     articlesCount: state.articles.articlesCount,
//     a: state.auth.a,
//   });

//   const mapDispatchToProps = (dispatch) => ({
//     fetchArticles: () => dispatch(getArticles()),
//     getArticleCount: () => dispatch(getArticleCount()),
//     setCurrentArticle: (article) => dispatch(setCurrentArticle(article)),
//   });

const CategoryArticles = ({ articleType, history, dontNavigate, location }) => {
  const pageNumber = Number(location.search.split("e")[1]);

  const [pageOfItems, setPageOfItems] = useState([]);
  const [page, setPage] = useState(pageNumber ? pageNumber : 1);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const a = useSelector((state) => state.auth.a);
  const filters = useSelector((state) => state.filters);
  const fetchedByCategory = useSelector(
    (state) => state.categoryArticles.fetchedByCategory
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (articles === undefined || articles?.length === 0) {
      dispatch(getArticles(articleType));
    }
  }, []);

  useEffect(() => {
    if (articles === undefined || articles?.length === 0) {
      dispatch(getArticles(articleType));
    }
  }, [articleType]);

  // useEffect(() => {
  //   setPageOfItems([]);
  // }, [articles]);

  // console.log(`--- IN CATEGORYARTICLES with ${articleType} ---`);
  // console.log(pageOfItems);
  // console.log(articles);
  // console.log(fetchedByCategory);
  // console.log(page);

  // useEffect(() => {
  // if (nextProps.articles.length !== this.state.articles.length) {
  //     this.setState({ articles: nextProps.articles });
  //      }
  // }, [articles.length]);

  const setCurrentArticleAndGoTo = (article, id) => {
    if (dontNavigate) {
      return;
    }
    dispatch(setCurrentArticle(article));
    history.push(`/${articleType}/${id}`);
  };

  const onChangePage = (pageOfItems, pageNumber) => {
    // update state with new page of items
    setPageOfItems(pageOfItems);
    setPage(pageNumber);

    if (pageNumber) {
      history.push({
        search: `?page${pageNumber}`,
      });
    }
  };
  const pagination = (
    <Pagination items={articles} onChangePage={onChangePage} page={page} />
  );

  // const sortedArticles = sortCategoryArticlesByLevelAndArticleNumber(articles);

  // const dummyArticles = [
  //   { articleNumber: "10", difficulty: "10" },
  //   { articleNumber: "10", difficulty: "1" },
  //   { articleNumber: "9", difficulty: "1" },
  //   { articleNumber: "1", difficulty: "10" },
  //   { articleNumber: "1", difficulty: "10" },
  //   { articleNumber: "1", difficulty: "1" },
  // ];
  // sortCategoryArticlesByLevelAndArticleNumber(dummyArticles);

  const sortedArticles = sortCategoryArticlesByLevelAndArticleNumber(articles);
  const filteredArticles = filterCategoryArticles(sortedArticles, filters);

  let articleJSX;
  if (filteredArticles?.length && filteredArticles?.length !== 0) {
    //articleJSX = pageOfItems.map((article, idx) => (
    articleJSX = filteredArticles.map((article, idx) => (
      <CategoryArticleListItem
        key={article.id}
        createdAt={article.createdAt}
        body={article.body}
        category={article.category}
        difficulty={article.difficulty}
        articleNumber={article.articleNumber}
        id={article.id}
        teaser={article.teaser}
        teaser_board={article.teaser_board}
        title={article.title}
        router={history}
        a={a}
        clickHandler={setCurrentArticleAndGoTo}
        articleType={articleType}
      />
    ));
  }

  const isMobileSize = window.innerWidth <= 672; // 6
  let articleJSXLeft;
  let articleJSXRight;
  if (articleJSX && !isMobileSize) {
    articleJSXLeft = articleJSX.filter((article, idx) => idx % 2 === 0);
    articleJSXRight = articleJSX.filter((article, idx) => idx % 2 !== 0);
  }

  return (
    <div className="Articles-outer_div">
      <FiltersCategoryArticles />

      <Add goto={`create/${articleType}`} history={history} />

      {/* {articles?.length > 0 && (
        <div className="Articles-Pagination center-align">{pagination}</div>
      )} */}

      {!isMobileSize && (
        <div className="Articles-container">
          <div className="Articles-container-left">{articleJSXLeft}</div>
          <div className="Articles-container-right">{articleJSXRight}</div>
        </div>
      )}
      {isMobileSize && <div className="Articles-container">{articleJSX}</div>}

      <br />
      <br />
    </div>
  );
};

export default CategoryArticles;
