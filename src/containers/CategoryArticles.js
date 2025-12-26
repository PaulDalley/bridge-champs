import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import {
  getArticles,
  setCurrentArticle,
} from "../store/actions/categoryArticlesActions";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import {
  filterCategoryArticles,
  sortCategoryArticlesByLevelAndArticleNumber,
} from "../helpers/helpers";
import CategoryArticleListItem from "../components/Articles/CategoryArticleListItem";
import "./CategoryArticles.css";
import FiltersCategoryArticles from "./FiltersCategoryArticles";

const CategoryArticles = ({ articleType, history, dontNavigate, location }) => {
  const pageNumber = Number(location.search.split("e")[1]);

  const [page, setPage] = useState(pageNumber ? pageNumber : 1);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const a = useSelector((state) => state.auth.a);
  const filters = useSelector((state) => state.filters);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articleType]);

  const setCurrentArticleAndGoTo = (article, id) => {
    if (dontNavigate) {
      return;
    }
    dispatch(setCurrentArticle(article));
    history.push(`/${articleType}/${id}`);
  };

  const sortedArticles = sortCategoryArticlesByLevelAndArticleNumber(articles);
  const filteredArticles = filterCategoryArticles(sortedArticles, filters);

  let articleJSX;
  if (filteredArticles?.length && filteredArticles?.length !== 0) {
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

  const getCategoryInfo = () => {
    switch(articleType) {
      case 'defence': 
        return { name: 'Defence', subtitle: 'Master defensive strategies' };
      case 'cardPlay': 
        return { name: 'Declarer Play', subtitle: 'Enhance your declarer skills' };
      case 'bidding': 
        return { name: 'Bidding', subtitle: 'Improve your bidding judgment' };
      default: 
        return { name: articleType, subtitle: 'Expert bridge articles and analysis' };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="CategoryArticles">
      <Add goto={`create/${articleType}`} history={history} />

      <div className="CategoryArticles-header">
        <div className="container">
          <h1 className="CategoryArticles-title">{categoryInfo.name}</h1>
          <p className="CategoryArticles-subtitle">
            {categoryInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="CategoryArticles-filters-section">
        <div className="container">
          <FiltersCategoryArticles />
        </div>
      </div>

      <div className="CategoryArticles-content">
        <div className="container">
          {filteredArticles && filteredArticles.length > 0 ? (
            <div className="CategoryArticles-grid">
              {articleJSX}
            </div>
          ) : (
            <div className="CategoryArticles-empty">
              <p>No articles found matching your filters.</p>
              <p>Try adjusting your difficulty level filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryArticles;
