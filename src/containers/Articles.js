import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import {
  getArticles,
  getArticlesChunk,
  getArticleCount,
  setCurrentArticle,
} from "../store/actions/articlesActions";
import { resetFilters } from "../store/actions/filtersActions";

import { filterArticles } from "../helpers/helpers";
import ArticleListItem from "../components/Articles/ArticleListItem";
import "./Articles.css";

export class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: this.props.articles,
    };
  }

  componentDidMount() {
    if (
      this.props.articles === undefined ||
      this.props.articles?.length === 0 ||
      this.props.fetchedByCategory
    ) {
      this.props.fetchArticles();
    }
  }

  setCurrentArticleAndGoTo = (article, id) => {
    if (this.props.dontNavigate) {
      return;
    }
    this.props.setCurrentArticle(article);
    this.props.history.push(`/article/${id}`);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.articles?.length !== this.state.articles?.length) {
      this.setState({ articles: nextProps.articles });
    }
  }

  componentWillUnmount() {
    try {
      this.props.resetFilters();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let articleJSX;
    if (this.state.articles?.length !== 0) {
      articleJSX = this.state.articles.map((article, idx) => (
        <ArticleListItem
          key={article.id}
          createdAt={article.createdAt}
          body={article.body}
          category={article.category}
          difficulty={article.difficulty}
          id={article.id}
          teaser={article.teaser}
          teaser_board={article.teaser_board}
          title={article.title}
          router={this.props.history}
          a={this.props.a}
          clickHandler={this.setCurrentArticleAndGoTo}
        />
      ));
    }

    const isMobileSize = window.innerWidth <= 672;
    let articleJSXLeft;
    let articleJSXRight;
    if (articleJSX && !isMobileSize) {
      articleJSXLeft = articleJSX.filter((article, idx) => idx % 2 === 0);
      articleJSXRight = articleJSX.filter((article, idx) => idx % 2 !== 0);
    }

    return (
      <div className="Articles-outer_div">
        <div className="CategoryArticles-header">
          <div className="container">
            <h1 className="CategoryArticles-title">Articles</h1>
            <p className="CategoryArticles-subtitle">
              Comprehensive bridge instruction
            </p>
          </div>
        </div>
        
        <div className="CategoryArticles-content">
          <div className="container">
            <Add goto="create/article" history={this.props.history} />

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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  articles: filterArticles(state.articles.articles, state.filters),
  fetchedByCategory: state.articles.fetchedByCategory,
  articlesCount: state.articles.articlesCount,
  a: state.auth.a,
});

const mapDispatchToProps = (dispatch) => ({
  fetchArticles: () => dispatch(getArticles()),
  getArticleCount: () => dispatch(getArticleCount()),
  setCurrentArticle: (article) => dispatch(setCurrentArticle(article)),
  resetFilters: () => dispatch(resetFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Articles);
