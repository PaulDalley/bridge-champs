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
import Filters from "./Filters";
import { CardPanel } from "react-materialize";
import Pagination from "../components/Pagination";

export class Articles extends Component {
  // title: this.state.title,
  // category: this.state.category,
  // difficulty: this.state.difficulty,
  // teaser: this.state.teaser,
  // createdAt: ...
  constructor(props) {
    super(props);
    const pageNumber = Number(this.props.location.search.split("e")[1]);
    const page = pageNumber ? pageNumber : 1;
    this.state = {
      pageOfItems: [],
      articles: this.props.articles,
      page,
    };
  }

  componentDidMount() {
    if (this.props.articles.length === 0 || this.props.fetchedByCategory) {
      this.props.fetchArticles();
    }
    // console.log(this.state);
    // else {
    //     this.setState({articles: this.props.articles });
    // }
    // console.log(this.props);

    // Number(this.props.location.search.split('e')[1]);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return this.props.articles.length !== nextProps.articles.length;
  // }

  setCurrentArticleAndGoTo = (article, id) => {
    if (this.props.dontNavigate) {
      return;
    }
    this.props.setCurrentArticle(article);
    this.props.history.push(`/article/${id}`);
  };

  componentWillReceiveProps(nextProps) {
    // console.log("ARTICLE DATA SHOULD BE ARRIVING");
    // console.log(nextProps.articles);
    if (nextProps.articles.length !== this.state.articles.length) {
      this.setState({ articles: nextProps.articles });
    }

    // if (this.props.articles.length === 0) {
    //     this.setState({ pageOfItems: []});
    // }
    // this.setState({articles: nextProps.articles,
    //                 pageOfItems: nextProps.articles.slice(0,10) });

    // this.setState({articles: nextProps.articles });
    // if (this.state.articles.length === 0) {
    //     this.setState({
    //         pageOfItems: []
    //     });
    // }

    // if (this.state.articles.length === 0) {
    //     this.setState({articles: nextProps.articles, pageOfItems: nextProps.articles });
    // }
    // else {
    //     this.setState({articles: nextProps.articles});
    // }

    // this.forceUpdate();
    // console.log(nextProps.articles[0]);
  }

  // gotoAddArticle = (e) => {
  //     e.preventDeafault();
  //     this.props.history.push('create/article');
  // }

  componentWillUnmount() {
    this.props.resetFilters();
  }

  onChangePage = (pageOfItems, pageNumber) => {
    // update state with new page of items
    this.setState({
      pageOfItems,
      page: pageNumber,
    });
    if (pageNumber) {
      this.props.history.push({
        search: `?page${pageNumber}`,
      });
    }
    // console.log(this.props);
  };

  render() {
    const pagination = (
      <Pagination
        items={this.state.articles}
        onChangePage={this.onChangePage}
        page={this.state.page}
      />
    );

    let articleJSX;
    if (this.state.articles.length !== 0) {
      articleJSX = this.state.pageOfItems.map((article, idx) => (
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
    // console.log(articleJSX.length);

    // let len = articleJSX.length / 2;
    // let articleJSXLeft = articleJSX.filter((article, idx) => idx < len);
    // let articleJSXRight = articleJSX.filter((article, idx) => idx >= len);
    const isMobileSize = window.innerWidth <= 672; // 6
    let articleJSXLeft;
    let articleJSXRight;
    if (articleJSX && !isMobileSize) {
      articleJSXLeft = articleJSX.filter((article, idx) => idx % 2 === 0);
      articleJSXRight = articleJSX.filter((article, idx) => idx % 2 !== 0);
    }
    // console.log(window.innerWidth);
    // console.log(isMobileSize);

    return (
      <div className="Articles-outer_div">
        {/*<CardPanel className="Articles-filters">*/}
        <Filters page="articles" />
        {/*</CardPanel>*/}
        <Add goto="create/article" history={this.props.history} />

        {this.props.articles.length > 0 && (
          <div className="Articles-Pagination center-align">
            {pagination}
            {/*<Pagination items={this.props.articles} onChangePage={this.onChangePage} />*/}
          </div>
        )}

        {!isMobileSize && (
          <div className="Articles-container">
            <div className="Articles-container-left">{articleJSXLeft}</div>
            <div className="Articles-container-right">{articleJSXRight}</div>
          </div>
        )}
        {isMobileSize && <div className="Articles-container">{articleJSX}</div>}

        <br />
        <br />

        {/*Hello from articles*/}
        {/*<ul className="pagination">*/}
        {/*<li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>*/}
        {/*<li className="active"><a href="#!">1</a></li>*/}
        {/*<li className="waves-effect"><a href="#!">2</a></li>*/}
        {/*<li className="waves-effect"><a href="#!">3</a></li>*/}
        {/*<li className="waves-effect"><a href="#!">4</a></li>*/}
        {/*<li className="waves-effect"><a href="#!">5</a></li>*/}
        {/*<li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>*/}
        {/*</ul>*/}
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
