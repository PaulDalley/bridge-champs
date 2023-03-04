import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import QuizListItem from "../components/Quizzes/QuizListItem";
import "./Quizzes.css";
import { getQuizzes, setCurrentQuiz } from "../store/actions/quizzesActions";
import { getArticleCount } from "../store/actions/articlesActions";
import Filters from "./Filters";
import { CardPanel, Input } from "react-materialize";
import Pagination from "../components/Pagination";
import { filterQuizzes } from "../helpers/helpers";

class Quizzes extends Component {
  constructor(props) {
    super(props);
    const pageNumber = Number(this.props.location.search.split("e")[1]);
    const page = pageNumber ? pageNumber : 1;
    this.state = {
      pageOfItems: [],
      quizzes: this.props.quizzes,
      page,
      hideCompleted: false,
    };
  }

  // state = {
  //     pageOfItems: [],
  //     quizzes: this.props.quizzes,
  //     page: 1,
  // hideCompleted: true,
  // }

  hideCompletedQuizzesChanged = (e) => {
    // e.preventDefault();
    // console.log(e.target.checked);
    // this.setState(prevState => ({artificialBidChecked: !prevState.artificialBidChecked}));
    // this.setState({hideCompleted: e.target.checked}, () => console.log(this.state.hideCompleted));
    console.log(this.state.filters);
    const newFilters = { ...this.state.filters };
    newFilters["hideCompletedQuizzes"] = e.target.checked;
    console.log(newFilters);
  };

  onChangePage = (pageOfItems, page) => {
    // update state with new page of items
    this.setState({
      pageOfItems,
      page,
    });
    this.props.history.push({
      search: `?page${page}`,
    });
  };

  componentDidMount() {
    // this.props.fetchQuizzes();
    // console.log("QUIZZES MOUNTING");
    // console.log(this.props);
    if (this.props.quizzes.length === 0) {
      this.props.fetchQuizzes();
    }

    // } else {
    //     console.log("UPDATING QUIZZES STATE with " + this.props.quizzes.length + " QUIZZES");
    //     this.setState({ quizzes: this.props.quizzes }, () => {
    //         console.log(this.state);
    //     });
    // }

    // console.log(this.props);
    // const pageNumber = Number(this.props.location.search.split('e')[1]);
    // if (pageNumber !== 1) {
    //     this.setState({page: pageNumber});
    // }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("QUIZ DATA SHOULD BE ARRIVING");
    // console.log(nextProps.quizzes);

    if (nextProps.quizzes.length !== this.state.quizzes.length)
      this.setState({ quizzes: nextProps.quizzes });

    // console.log(nextProps.quizScores);
    // console.log(nextProps.totalQuizScore);
  }

  setCurrentQuizAndGoTo = (quiz, id) => {
    // console.log("SETTING CURRENT QUIZ");
    // console.log(quiz);
    this.props.setCurrentQuiz(quiz);
    this.props.history.push(`/quiz/${id}`);
  };

  render() {
    // console.log(this.state.quizzes);
    // console.log(this.props.quizScores);
    // let quizzesToUse = this.state.quizzes;
    // if (this.state.hideCompleted) {
    //     quizzesToUse = this.state.quizzes.filter(quiz => {
    //         const quizScore = this.props.quizScores[quiz.body];
    //         return (!quizScore) || !(quizScore === 0);
    //     });
    // } else {
    //     quizzesToUse = this.state.quizzes;
    // }

    const pagination = (
      <Pagination
        items={this.state.quizzes}
        onChangePage={this.onChangePage}
        page={this.state.page}
      />
    );
    let quizzesJSX;

    // let quizzesJSX = this.props.quizzes.map(quiz => (
    // if (this.state.quizzes.length !== 0) {
    if (this.state.quizzes.length !== 0) {
      quizzesJSX = this.state.pageOfItems.map((quiz) => {
        let completed = false;
        let quizScore;
        if (this.props.quizScores) {
          quizScore = this.props.quizScores[quiz.body];
          completed = quizScore || quizScore === 0;
        }
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
            a={this.props.a}
            clickHandler={this.setCurrentQuizAndGoTo}
            completed={completed}
          />
        );
      });
    }

    // console.log(quizzesJSX.length);

    // let len = quizzesJSX.length / 2;
    // let articleJSXLeft = articleJSX.filter((article, idx) => idx < len);
    // let articleJSXRight = articleJSX.filter((article, idx) => idx >= len);

    const isMobileSize = window.innerWidth <= 672;
    let quizzesJSXLeft;
    let quizzesJSXRight;
    if (quizzesJSX && !isMobileSize) {
      quizzesJSXLeft = quizzesJSX.filter((article, idx) => idx % 2 === 0);
      quizzesJSXRight = quizzesJSX.filter((article, idx) => idx % 2 !== 0);
    }
    // console.log(window.innerWidth);
    // console.log(isMobileSize);

    return (
      <div className="Articles-outer_div">
        {/*<CardPanel className="Articles-filters">*/}
        <Filters
          page="quizzes"
          quizScores={this.props.quizScores}
          hideCompletedQuizzes={this.state.hideCompleted}
        />
        {/*</CardPanel>*/}
        <br />

        <Add goto="create/quiz" history={this.props.history} />

        {this.props.quizzes.length > 0 && (
          <div className="Articles-Pagination center-align">
            {pagination}
            {/*<Pagination items={this.props.quizzes} onChangePage={this.onChangePage} />*/}
            {/*<Pagination items={quizzesJSX} onChangePage={this.onChangePage} />*/}
          </div>
        )}

        {!isMobileSize && (
          <div className="Articles-container Quizzes-container">
            <div className="Articles-container-left">{quizzesJSXLeft}</div>
            <div className="Articles-container-right">{quizzesJSXRight}</div>
          </div>
        )}
        {isMobileSize && <div className="Articles-container">{quizzesJSX}</div>}

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

const mapStateToProps = (state, ownProps) => {
  return {
    a: state.auth.a,
    quizzes: filterQuizzes(
      state.quizzes.quizzes,
      state.filters,
      state.auth.quizScores
    ),
    quizzesCount: state.articles.quizzesCount,
    quizScores: state.auth.quizScores || {},
    totalQuizScore: state.auth.totalQuizScore,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchQuizzes: () => dispatch(getQuizzes()),
  getArticleCount: () => dispatch(getArticleCount()),
  setCurrentQuiz: (quiz) => dispatch(setCurrentQuiz(quiz)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Quizzes);
