import React, { Component } from "react";
import { connect } from "react-redux";
import Add from "./Add";
import QuizListItem from "../components/Quizzes/QuizListItem";
import "./Quizzes.css";
import { getQuizzes, setCurrentQuiz } from "../store/actions/quizzesActions";
import { getArticleCount } from "../store/actions/articlesActions";
import { filterQuizzes } from "../helpers/helpers";
import { resetFilters } from "../store/actions/filtersActions";

class Quizzes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: this.props.quizzes,
      hideCompleted: false,
    };
  }

  hideCompletedQuizzesChanged = (e) => {
    const newFilters = { ...this.state.filters };
    newFilters["hideCompletedQuizzes"] = e.target.checked;
  };

  componentDidMount() {
    if (this.props.quizzes.length === 0) {
      this.props.fetchQuizzes();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quizzes.length !== this.state.quizzes.length)
      this.setState({ quizzes: nextProps.quizzes });
  }

  componentWillUnmount() {
    this.props.resetFilters();
  }

  setCurrentQuizAndGoTo = (quiz, id) => {
    this.props.setCurrentQuiz(quiz);
    this.props.history.push(`/quiz/${id}`);
  };

  render() {
    let quizzesJSX;

    if (this.state.quizzes.length !== 0) {
      quizzesJSX = this.state.quizzes.map((quiz) => {
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

    const isMobileSize = window.innerWidth <= 672;
    let quizzesJSXLeft;
    let quizzesJSXRight;
    if (quizzesJSX && !isMobileSize) {
      quizzesJSXLeft = quizzesJSX.filter((article, idx) => idx % 2 === 0);
      quizzesJSXRight = quizzesJSX.filter((article, idx) => idx % 2 !== 0);
    }

    return (
      <div className="Articles-outer_div">
        <div className="CategoryArticles-header">
          <div className="container">
            <h1 className="CategoryArticles-title">Quizzes</h1>
            <p className="CategoryArticles-subtitle">
              Practice and test your knowledge
            </p>
          </div>
        </div>
        
        <div className="CategoryArticles-content">
          <div className="container">
            <Add goto="create/quiz" history={this.props.history} />

        {!isMobileSize && (
          <div className="Articles-container Quizzes-container">
            <div className="Articles-container-left">{quizzesJSXLeft}</div>
            <div className="Articles-container-right">{quizzesJSXRight}</div>
          </div>
        )}
        {isMobileSize && <div className="Articles-container">{quizzesJSX}</div>}

        <br />
        <br />
          </div>
        </div>
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
  resetFilters: () => dispatch(resetFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Quizzes);
