import React, { Component } from "react";
import { fetchDataChunk } from "../../helpers/helpers";
import ArticleListItem from "../Articles/ArticleListItem";
import CategoryArticleListItem from "../Articles/CategoryArticleListItem";
import QuizListItem from "../Quizzes/QuizListItem";
import "./TopTen.css";
import { connect } from "react-redux";
import {
  setCurrentArticle,
  setTopTen,
} from "../../store/actions/articlesActions";
import { setCurrentArticle as setCurrentCategoryArticle } from "../../store/actions/categoryArticlesActions";

import { setCurrentQuiz } from "../../store/actions/quizzesActions";
import AnimatedButton from "../UI/AnimatedButton";
import { Carousel } from "react-materialize";
import { Tabs, Tab } from "react-materialize";
import ErrorBoundary from "../../helpers/ErrorBoundary";
// import $ from 'jquery';

class TopTen extends Component {
  state = {
    articles: [],
    cardPlay: [],
    defence: [],
    bidding: [],
    quizzes: [],
    activeClass: "articles",
  };

  ignoreClick = (x, y) => {
    return;
  };
  articleClickHandler = (x, y) => {
    return this.setCurrentArticleAndGoTo(x, y);
    // if (this.state.activeClass === 'articles') return this.setCurrentArticleAndGoTo(x, y);
    // else {
    //     // this.setState({activeClass: 'articles'});
    //     return this.ignoreClick(x, y);
    // }
  };

  categoryArticleClickHandler = (articleObj, body, articleType) => {
    return this.setCurrentCategoryArticleAndGoTo(articleObj, body, articleType);
  };

  quizClickHandler = (x, y) => {
    return this.setCurrentQuizAndGoTo(x, y);
    // if (this.state.activeClass === 'quizzes') return this.setCurrentQuizAndGoTo(x, y);
    // else {
    //     // this.setState({activeClass: 'quizzes'});
    //     return this.ignoreClick(x, y);
    // }
  };

  setCurrentArticleAndGoTo = (article, id) => {
    this.props.setCurrentArticle(article);
    this.props.history.push(`/article/${id}`);
  };

  setCurrentCategoryArticleAndGoTo = (article, id, articleType) => {
    this.props.setCurrentCategoryArticle(article);
    this.props.history.push(`/${articleType}/${id}`);
  };

  setCurrentQuizAndGoTo = (quiz, id) => {
    // console.log("SETTING CURRENT QUIZ");
    // console.log(quiz);
    this.props.setCurrentQuiz(quiz);
    this.props.history.push(`/quiz/${id}`);
  };

  componentDidMount() {
    if (this?.props?.topTen?.length !== 0) {
      this.setState({
        topTen: this.props.topTen,
        // topTenQuizzes: this.props.topTenQuizzes,
        quizzes: this.props.topTenQuizzes,
      });
      return;
    }

    fetchDataChunk("articles", 10, "createdAt").then((articles) => {
      this.props.passUpArticlesRef(articles);
      this.setState({ articles });
    });
    fetchDataChunk("quizzes", 10, "createdAt").then((quizzes) =>
      this.setState({ quizzes })
    );
    fetchDataChunk("cardPlay", 10, "createdAt").then((cardPlay) =>
      this.setState({ cardPlay })
    );
    fetchDataChunk("defence", 10, "createdAt").then((defence) =>
      this.setState({ defence })
    );
    fetchDataChunk("bidding", 10, "createdAt").then((bidding) =>
      this.setState({ bidding })
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.topTen !== nextProps.topTen) return true;
    // if (
    //   this.state?.topTen?.length !== nextState.topTen ||
    //   this.state?.topTenQuizzes?.length !== nextState.topTenQuizzes
    // )
    //   return true;
    if (this.state?.topTen?.length !== nextState.topTen) return true;
    if (this.state?.articleListJSX !== undefined) return false;
    if (this.state?.quizListJSX !== undefined) return false;

    const bool =
      this.state.articles.length !== nextState.articles.length ||
      this.state.quizzes.length !== nextState.articles.length ||
      this.state.articleListJSX !== nextState.articleListJSX ||
      this.state.quizListJSX !== nextState.quizListJSX ||
      this.state.activeClass !== nextState.activeClass;
    // console.log(bool);
    return bool;
  }

  componentDidUpdate() {
    // console.log(this.state);
    // console.log(this.props.quizScores);
    const { quizzes, articles, cardPlay, bidding, defence } = this.state;
    // console.log(quizzes);
    // console.log(articles);
    let quizListJSX;
    let articleListJSX;
    let _allToUse = [];
    let _quizzesToUse = quizzes;

    if (this.props?.topTen?.length === 0) {
      const allArticleContent = [
        ...cardPlay,
        ...bidding,
        ...defence,
        ...articles,
      ];

      _allToUse = allArticleContent.sort((a, b) => {
        return b.createdAt.toDate() - a.createdAt.toDate();
      });

      _allToUse = _allToUse.slice(0, 12);
      this.props.setTopTen(_allToUse, quizzes);
    } else {
      _allToUse = this.props.topTen;
      _quizzesToUse = this.props.topTenQuizzes;
    }

    if (_allToUse?.length > 0 && this.state.articleListJSX === undefined) {
      articleListJSX = this.getArticlesJSX(_allToUse);
      this.setState({ articleListJSX });
    }

    if (
      _quizzesToUse?.length > 0 &&
      this.state.quizListJSX === undefined &&
      this.props.quizScores !== undefined
    ) {
      quizListJSX = this.getQuizzesJSX(_quizzesToUse);
      this.setState({ quizListJSX });
    }

    // console.log(articleListJSX);
    // console.log(quizListJSX);
  }

  // getArticlesJSX = (articles) => {
  //   return articles.map((article) => (
  //     <ArticleListItem
  //       key={article.id}
  //       createdAt={article.createdAt}
  //       body={article.body}
  //       category={article.category}
  //       difficulty={article.difficulty}
  //       id={article.id}
  //       teaser={article.teaser}
  //       teaser_board={article.teaser_board}
  //       title={article.title}
  //       router={this.props.history}
  //       clickHandler={this.articleClickHandler}
  //     />
  //   ));
  // };

  getArticlesJSX = (articles) => {
    return articles.map((article) => {
      if (article.from === "articles") {
        return (
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
            clickHandler={this.articleClickHandler}
          />
        );
      } else {
        return (
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
            router={this.props.history}
            clickHandler={this.categoryArticleClickHandler}
            articleType={article.from}
            displayArticleType={true}
          />
        );
      }
    });
  };

  getQuizzesJSX = (quizzes) => {
    return quizzes.map((quiz) => {
      // console.log(this.props.quizScores);
      // const quizScore = this.props.quizScores[quiz.body];
      // const completed = quizScore || quizScore === 0;
      const completed = false;
      return (
        <QuizListItem
          key={quiz.id}
          date={quiz.date}
          body={quiz.body}
          quizType={quiz.quizType}
          id={quiz.id}
          teaser={quiz.teaser}
          teaser_board={quiz.teaser_board}
          title={quiz.title}
          difficulty={quiz.difficulty}
          router={this.props.history}
          clickHandler={this.quizClickHandler}
          completed={completed}
        />
      );
    });
  };

  componentWillReceiveProps(nextProps) {
    // const { quizzes, articles } = nextProps;
    // let quizListJSX;
    // let articleListJSX;
    // if (articles.length > 0) {
    //     articleListJSX = this.getArticlesJSX(articles);
    // }
    // if (quizzes.length > 0) {
    //     quizListJSX = this.getQuizzesJSX(quizzes);
    // }
    // this.setState({ articleListJSX, quizListJSX });
    // console.log(articleListJSX);
    // console.log(quizListJSX);
  }

  setActiveClass = (className) => {
    this.setState({ activeClass: className });
  };

  toggleActive = () => {
    // console.log("toggle clicked");
    this.setState(
      (prevState) => ({
        activeClass:
          prevState.activeClass === "articles" ? "quizzes" : "articles",
      }),
      () => console.log(this.state)
    );
  };

  render() {
    const { quizzes, articles, quizListJSX, articleListJSX } = this.state;
    let activeClass_articles = "";
    let activeClass_quizzes = "";
    let inactiveClass_articles = "TopTen-list-inactive-articles";
    let inactiveClass_quizzes = "TopTen-list-inactive-quizzes";
    let articlesActive = false;
    let quizzesActive = false;
    switch (this.state.activeClass) {
      case "articles":
        activeClass_articles = "TopTen-list-active";
        inactiveClass_articles = "";
        articlesActive = true;
        break;
      case "quizzes":
        activeClass_quizzes = "TopTen-list-active";
        inactiveClass_quizzes = "";
        quizzesActive = true;
        break;
    }

    // console.log(quizzes);
    // console.log(articles);

    // const singleColumnDisplay = window.innerWidth <= 600;
    // console.log(singleColumnDisplay);

    // const tabsOptions = {
    //     swipeable: true,
    //     responsiveThreshold: '100px'
    // };

    return (
      <div style={{ position: "relative", top: "-15rem" }}>
        {this.state.quizzes.length > 0 && articleListJSX?.length > 0 && (
          <h1 className="TopTen-title">Latest Content</h1>
        )}
        <div className="TopTen-list-container">
          {/*<button ref={ btn => {*/}
          {/*if (btn != null) btn.onclick=this.toggleActive*/}
          {/*}*/}
          {/*}>*/}
          {/*TOGGLE*/}
          {/*</button>*/}

          {/*{articles.length > 0 &&*/}
          {/*<div onClick={() => this.setActiveClass('articles')}*/}
          {/*className={`TopTen-list ${activeClass_articles} ${inactiveClass_articles}`}*/}
          {/*style={{zIndex: articlesActive ? "1000" : "500" }}*/}
          {/*>*/}
          {/*<h1 style={{fontFamily: "Dancing Script, cursive",*/}
          {/*textAlign: 'center', fontSize: '6rem',*/}
          {/*fontWeight: 'bold', cursor: 'pointer',*/}
          {/*}}>Articles</h1>*/}
          {/*{articleListJSX}*/}
          {/*</div>}*/}

          {/*{ quizzes.length > 0 &&*/}
          {/*<div onClick={() => this.setActiveClass('quizzes')}*/}
          {/*className={`TopTen-list ${activeClass_quizzes} ${inactiveClass_quizzes}`}*/}
          {/*style={{*/}
          {/*zIndex: quizzesActive ? "1000" : "500" }}*/}
          {/*>*/}
          {/*<h1 style={{fontFamily: "Dancing Script, cursive", textAlign: 'center', fontSize: '6rem',*/}
          {/*fontWeight: 'bold',  cursor: 'pointer',*/}
          {/*}}>Quizzes</h1>*/}
          {/*{quizListJSX}*/}
          {/*</div>}*/}

          {articleListJSX?.length > 0 && (
            <div
            // style={{transform: "scale(.85)", position: "relative", top: "-45rem"}}
            >
              <h1
                style={{
                  fontFamily: "Dancing Script, cursive",
                  textAlign: "center",
                  fontSize: "4.5rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Articles
              </h1>
              {articleListJSX}
            </div>
          )}

          {quizzes.length > 0 && (
            <div
            // style={{transform: "scale(.85)", position: "relative", top: "-45rem"}}
            >
              <h1
                style={{
                  fontFamily: "Dancing Script, cursive",
                  textAlign: "center",
                  fontSize: "4.5rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Quizzes
              </h1>
              {quizListJSX}
            </div>
          )}
        </div>

        {window.innerWidth <= 800 && articleListJSX?.length > 0 && (
          <div>{articleListJSX}</div>
        )}
        {/* <ErrorBoundary>
          <div className="TopTen-tabs">
            <Tabs
              className="tab-top-ten z-depth-1"
              options={{
                duration: 300,
                onShow: null,
                responsiveThreshold: Infinity,
                swipeable: false,
              }}
              title="top-ten"
            >
              <Tab title="Articles">
                {articleListJSX.length > 0 && <div>{articleListJSX}</div>}
              </Tab>
              <Tab title="Quizzes" active>
                {quizzes.length > 0 && <div>{quizListJSX}</div>}
              </Tab>
            </Tabs>
          </div>
        </ErrorBoundary> */}

        {/*<ul id="tabs-swipe-demo" className="tabs">*/}
        {/*<li className="tab col s3"><a className="active" href="#test-swipe-1">Articles</a></li>*/}
        {/*<li className="tab col s3"><a href="#test-swipe-2">Quizzes</a></li>*/}
        {/*/!*<li class="tab col s3"><a href="#test-swipe-3">Test 3</a></li>*!/*/}
        {/*</ul>*/}
        {/*<div id="test-swipe-1" className="col s12">*/}
        {/*/!*<h1 style={{*!/*/}
        {/*/!*fontFamily: "Dancing Script, cursive",*!/*/}
        {/*/!*textAlign: 'center', fontSize: '4.5rem',*!/*/}
        {/*/!*fontWeight: 'bold', cursor: 'pointer',*!/*/}
        {/*/!*}}>Articles</h1>*!/*/}
        {/*{articles.length > 0 &&*/}
        {/*<div className={`TopTen-list ${activeClass_articles}`}>*/}
        {/*{articleListJSX}*/}
        {/*</div>}*/}
        {/*</div>*/}

        {/*<div id="test-swipe-2" className="col s12">*/}
        {/*/!*<h1 style={{*!/*/}
        {/*/!*fontFamily: "Dancing Script, cursive", textAlign: 'center',*!/*/}
        {/*/!*fontSize: '4.5rem',*!/*/}
        {/*/!*fontWeight: 'bold', cursor: 'pointer',*!/*/}
        {/*/!*}}>Quizzes</h1>*!/*/}
        {/*{ quizzes.length > 0 &&*/}
        {/*<div className={`TopTen-list ${activeClass_quizzes}`}>*/}
        {/*{quizListJSX}*/}
        {/*</div>}*/}
        {/*</div>*/}
        {/*<div id="test-swipe-3" class="col s12 green">Test 3</div>*/}

        {/*<div className="TopTen-list-container-carousel">*/}
        {/*<Carousel options={{fullWidth: true}}*/}
        {/*className="TopTen-carousel"*/}
        {/*indicators={true}*/}
        {/*numVisible={2}*/}
        {/*>*/}
        {/*<div className='F5F5F5'>*/}
        {/*<h1 style={{*/}
        {/*fontFamily: "Dancing Script, cursive",*/}
        {/*textAlign: 'center', fontSize: '4.5rem',*/}
        {/*fontWeight: 'bold', cursor: 'pointer',*/}
        {/*}}>Articles</h1>*/}
        {/*{articles.length > 0 &&*/}
        {/*<div className={`TopTen-list ${activeClass_articles}`}>*/}
        {/*{articleListJSX}*/}
        {/*</div>}*/}
        {/*</div>*/}

        {/*<div className='F5F5F5'>*/}
        {/*<h1 style={{*/}
        {/*fontFamily: "Dancing Script, cursive", textAlign: 'center',*/}
        {/*fontSize: '4.5rem',*/}
        {/*fontWeight: 'bold', cursor: 'pointer',*/}
        {/*}}>Quizzes</h1>*/}
        {/*{ quizzes.length > 0 &&*/}
        {/*<div className={`TopTen-list ${activeClass_quizzes}`}>*/}
        {/*{quizListJSX}*/}
        {/*</div>}*/}
        {/*</div>*/}
        {/*</Carousel>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default connect(
  ({ auth, articles }) => ({
    quizScores: auth.quizScores || {},
    topTen: articles.topTen || [],
    topTenQuizzes: articles.topTenQuizzes || [],
  }),
  {
    setCurrentArticle,
    setCurrentCategoryArticle,
    setCurrentQuiz,
    setTopTen,
  }
)(TopTen);
