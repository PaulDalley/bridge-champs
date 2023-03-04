import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Button, Col, ProgressBar } from "react-materialize";
import { getQuiz, getQuizMetadata } from "../../store/actions/quizzesActions";
import {
  startSubmitUserQuizScore,
  getUserQuizScore,
  setCurrentQuizScore,
} from "../../store/actions/usersActions";
import { Markup } from "interweave";
import PlayHand from "../../components/BridgeBoard/play/PlayHand";
import $ from "jquery";

import {
  makeDateString,
  findQuizById,
  parseDocumentIntoJSX,
  getQuizData,
  makeBoardObjectFromString,
  getDifficultyStr,
  getWhoBidWhatSuitFirst,
  getLastBid,
} from "../../helpers/helpers";
import MakeBoard from "../../components/BridgeBoard/MakeBoard";
import BiddingGrid from "../BridgeBoard/BiddingGrid";
// import Bidding from '../BridgeBoard/Bidding';
import "./DisplayQuiz.css";

Object.equals = function (x, y) {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== "object") return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!Object.equals(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
    // allows x[ p ] to be set to undefined
  }
  return true;
};

export class DisplayQuiz extends Component {
  state = {
    loading: true,
    questionLoaded: false,
    answer: undefined,
    score: undefined,
    bidding: [],
    currentMaxBid: "0♣",
    quizAnswer: false,
    quizQuestion: false,
    hand: "",
    redoCompletedQuiz: false,
  };

  componentDidMount() {
    if (!this.props.dontScrollTop) {
      $("html, body").animate({ scrollTop: 0 }, 300);
    }

    if (!this.props.quizMetadata) {
      this.props.getQuizMetadata(this.props.match.params.id);
    }
    // this.setState({loading: true})
    if (this.props.quizScores) {
      // console.log("THERE ARE QUIZSCORES SO LETS SEE WHAT THEY ARE:")
      // console.log(this.props.quizScores[this.props.match.params.id]);
      // console.log(this.props.quizScores);
      // console.log(this.props.match.params.id);
      let existingScore = this.props.quizScores[this.props.match.params.id];
      if (existingScore && !this.state.redoCompletedQuiz) {
        this.setState({
          score: existingScore,
          registeredScore: existingScore,
          answer: true,
          loading: false,
          submitted: true,
        });
      }
    }
    // console.log("state.users object::");
    // console.log(this.props.quizScores);

    // console.log(this.props);
    // if (!this.props.quiz) {
    if (!this.props.haveData) {
      const quizId = this.props.match.params.id;
      this.props.getQuiz(quizId, this.props.history);
      this.setState({ loading: false, questionLoaded: true });
    }
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let changedProps = !Object.equals(this.props, nextProps);
    let changedState = !Object.equals(this.state, nextState);
    return changedProps || changedState;
  }

  componentDidUpdate() {
    // console.log("AFTER UPDATE");
    // console.log(this.props.quizScores);
    if (this.props.uid && !this.props.quizScoresFetched) {
      this.props.getUserQuizScore(this.props.uid, this.props.match.params.id);
    } else if (
      this.props.uid &&
      this.props.quizScoresFetched &&
      !this.props.currentQuizScore
    ) {
      // console.log("ALREADY HAVE QUIZ SCORES IN STATE");
      this.props.setCurrentQuizScore(this.props.match.params.id);
    }

    if (this.props.quizScores) {
      // console.log("THERE ARE QUIZSCORES SO LETS SEE WHAT THEY ARE:")
      // console.log(this.props.quizScores[this.props.match.params.id]);
      // console.log(this.props.quizScores);
      // console.log(this.props.match.params.id);
      let existingScore = this.props.quizScores[this.props.match.params.id];
      if (
        !this.state.redoCompletedQuiz &&
        (existingScore || existingScore === 0)
      ) {
        // console.log(" YOU HAVE ALREADY TAKEN THIS QUIZ NERD IN COMPONENT DID UPDATE");
        // console.log("YOUR SCORE IS ", existingScore);
        this.setState({
          score: existingScore,
          registeredScore: existingScore,
          answer: true,
          loading: false,
          submitted: true,
        });
      } else if (this.props.quizScoresFetched && !existingScore) {
        this.setState({ loading: false });
      }
    }
  }

  scoreUserAnswer = ({ move, suit }) => {
    const quizType = this.props.quizMetadata.quizType;
    let lowestScore;
    switch (quizType) {
      case "Bidding":
        lowestScore = 2;
        break;
      case "Opening Lead":
        lowestScore = 3;
        break;
    }

    if (move === "P") move = "Pass";
    const answers = this.props.quiz[this.props.match.params.id].answers;
    const numAnswers = answers.length;
    for (let i = 0; i < numAnswers; i++) {
      // console.log(answers[i].move);
      // console.log(move.toString());
      // console.log(answers[i].move === move.toString());
      if (answers[i].move === move.toString()) {
        // console.log("IN HERE");
        if (
          !answers[i].suit ||
          answers[i].suit === "None" ||
          answers[i].suit === suit
        ) {
          return answers[i].score;
        }
      }
    }
    return lowestScore;
  };

  retryQuiz = () => {
    // console.log(" IN HERE");
    this.setState({
      score: undefined,
      answer: false,
      loading: false,
      submitted: false,
      redoCompletedQuiz: true,
    });
  };

  submitAnswer = (e) => {
    e.preventDefault();
    if (this.state.submitted) return;
    if (this.state.quizScores) {
      if (this.state.quizScores[this.props.match.params.id]) {
        // console.log(" YOU HAVE ALREADY TAKEN THIS QUIZ NERD ");
        return;
      }
    }
    // console.log(this.state.answer);
    const score = this.scoreUserAnswer(this.state.answer);
    this.setState({ score, submitted: true });
    // console.log("MY SCORE: ", score);
    // console.log("MY UID: ", this.props.uid);
    if (!this.state.redoCompletedQuiz)
      this.props.startSubmitUserQuizScore(
        this.props.uid,
        score,
        this.props.match.params.id
      );
  };
  BiddingGridClicked = (i, suit) => {
    // console.log(i, suit);
    // console.log(i === "P");
    const answers = this.props.quiz[this.props.match.params.id].answers;
    // console.log(answers);
    this.setState({ answer: { move: i, suit } });
  };

  playHandCardClicked = (rank, suit) => {
    // console.log(rank, suit);
    this.setState({ answer: { move: rank, suit } });
  };

  generateAnswerOutputString = () => {
    // let answer = this.state.answer;
    let originalScoreString = "";
    if (
      this.state.registeredScore !== undefined &&
      this.state.score !== this.state.registeredScore
    ) {
      originalScoreString =
        " Your original score was " + this.state.registeredScore + ".";
    }
    if (this.state.score === "10") {
      return (
        "Congratulations, you have scored 10/10 Champion points for this quiz." +
        originalScoreString
      );
    } else {
      return (
        "You have scored " +
        this.state.score +
        " Champion points." +
        originalScoreString
      );
    }
  };

  fetchBidding = (bidding, currentMaxBid) => {
    // console.log(bidding, currentMaxBid);
    this.setState({ bidding, currentMaxBid });
  };

  render() {
    // console.log(this.props);
    const quizId = this.props.match.params.id;
    // console.log("quiz id")
    // console.log(quizId);

    let quiz;
    let quizAnswer;
    let quizQuestion = false;
    let boardData;
    let whoBidFirst;
    let lastBid;
    let hand = this.state.hand;

    // let { quizAnswer, quiz, quizQuestion, hand, boardData, whoBidFirst, lastBid,} = this.state;

    // ##** TODO: This shouldn't be here, don't know how to fix for now:
    if (this.props.quiz) {
      quiz = this.props.quiz[this.props.match.params.id];
      // console.log("SHOULD BE PARAMS HERE");
      // console.log(this.props);
      // console.log(this.props.match.params.id);
      // console.log("SHOULD BE A QUIZ HERE", quiz);
      // console.log("QUIZ QUESTION");

      if (quiz && !this.state.quizAnswer && !this.state.quizQuestion) {
        boardData = getQuizData(quiz.question);
        // console.log("BOARD DATA HERE:");
        // console.log(boardData);
        if (boardData.boardType === "single") {
          hand = boardData[boardData["position"]];
        }

        // console.log("HERE");
        // console.log(this.props.quizMetadata.quizType);
        quizAnswer = parseDocumentIntoJSX(quiz.answer);
        quizQuestion = parseDocumentIntoJSX(
          quiz.question,
          true,
          this.fetchBidding,
          this.props.quizMetadata.quizType
        );
        this.setState({ quizAnswer, quizQuestion, hand });

        // this.setState({answers: quiz.answers });

        // console.log("I HAVE RECEIVED A QUIZ");
        // console.log(quiz);
        // console.log("SETTING LOADED TO TRUE");
        // console.log(quiz.answers);
        this.setState({ loading: false, questionLoaded: true });
      }
    }

    let quizMetadata = {};
    if (this.props.quizMetadata) {
      // console.log("I HAVE QUIZ META DATA TOO:")
      // console.log(this.props.quizMetadata);
      quizMetadata = this.props.quizMetadata;
    } else {
      quizMetadata = findQuizById(this.props.quizzes, quizId);
    }

    if (boardData && quizMetadata) {
      if (quizMetadata.quizType === "Bidding" && !this.state.lastBid) {
        // "Declarer"
        whoBidFirst = getWhoBidWhatSuitFirst(boardData.bidding);
        lastBid = getLastBid(boardData.bidding);
        // console.log(boardData.bidding)
        // console.log(whoBidFirst);
        // console.log(lastBid);
        this.setState({
          lastBid: lastBid[0],
          lastBidWinner: lastBid[1],
          whoBidFirst,
        });
      }
    }
    // ##** END OF THIS SHOULDNT BE HERE

    const answerStyles = { opacity: 0, scale: 1.3 };
    const inputStyles = { opacity: 1, scale: 1 };
    if (this.state.submitted) {
      answerStyles.position = "relative";
      answerStyles.top = "-3rem";
      answerStyles.opacity = 1;
      answerStyles.scale = 1;
      inputStyles.opacity = 0;
      inputStyles.scale = 1.3;
    }

    if (
      !this.props.dailyFree &&
      (!this.props.quizScoresFetched ||
        this.state.loading ||
        !this.state.quizQuestion)
    ) {
      return (
        <div className="DisplayArticle-container">
          <Col s={12}>
            <ProgressBar />
          </Col>
        </div>
      );
    }

    // console.log(quizMetadata);
    // console.log(quiz);

    // let bidding = undefined;
    // if (boardData) bidding = boardData.bidding;

    return (
      <div className="DisplayArticle-container DisplayQuiz-container">
        {/*{this.state.submitted &&*/}
        {/*<div style={{position: 'absolute', right: '7.7rem', top: '7rem'}}>*/}
        {/*<Button floating large style={{backgroundColor: 'forestgreen'}} waves='light' icon='undo' />*/}
        {/*<br/>*/}
        {/*<span style={{*/}
        {/*position: 'relative',*/}
        {/*left: '.15rem',*/}
        {/*top: '.6rem',*/}
        {/*fontWeight: 'bold',*/}
        {/*fontSize: '1.2rem',*/}
        {/*textAlign: 'center',*/}
        {/*}}>Retry Quiz</span>*/}
        {/*</div>}*/}
        {quizMetadata && (
          <div>
            <h3 className="DisplayArticle-title">{quizMetadata.title}</h3>
            <div className="DisplayArticle-category">
              {quizMetadata.quizType}
            </div>
            <div
              className={`DisplayArticle-difficulty ArticlesListItem-difficulty-${quizMetadata.difficulty}`}
            >
              {getDifficultyStr(quizMetadata.difficulty)}
            </div>
            {this.state.submitted && (
              <div className="DisplayArticle-category DisplayQuiz-completed">
                Completed
              </div>
            )}

            {/*<div className={`DisplayArticle-difficulty ArticlesListItem-difficulty-${quizMetadata.difficulty}`}>{getDifficultyStr(articleMetadata.difficulty)}</div>*/}
            <div className="DisplayArticle-createdAt">
              {makeDateString(quizMetadata.date)}
            </div>
          </div>
        )}
        <br />
        <br />
        <br />
        <div className="DisplayQuiz-content_container">
          <div className="DisplayQuiz-quiz_question">
            {this.state.quizQuestion}
          </div>
          {quizMetadata.quizType === "Bidding" && !this.state.submitted && (
            <div className="DisplayQuiz-biddingInputArea" style={inputStyles}>
              {/*{false && <Bidding vuln={boardData.vuln}*/}
              {/*dealer={boardData.dealer}*/}
              {/*editable={true}*/}
              {/*bidding={boardData.bidding}*/}
              {/*updateBiddingGrid={(data) => console.log(data) }*/}
              {/*/> }*/}
              <div className="DisplayQuiz-biddingGrid">
                <BiddingGrid
                  bidding={this.state.bidding}
                  currentMaxBid={this.state.currentMaxBid}
                  clickHandler={(i, suit) => this.BiddingGridClicked(i, suit)}
                />

                <Button
                  className="CreateArticle-submit DisplayQuiz-submit"
                  onClick={(e) => this.submitAnswer(e)}
                  waves="light"
                >
                  Submit Answer
                  <Icon left>done_all</Icon>
                </Button>
              </div>
            </div>
          )}
        </div>

        {quizMetadata.quizType === "Opening Lead" && !this.state.submitted && (
          <div
            className="DisplayQuiz-hand_container"
            style={{ position: "relative", top: "-11rem" }}
          >
            <div className="DisplayQuiz-hand">
              <PlayHand
                hand={this.state.hand}
                passClickedCardUp={this.playHandCardClicked}
              />
            </div>
            {this.state.answer && (
              <Button
                className="CreateArticle-submit DisplayQuiz-submit-openingLead"
                onClick={(e) => this.submitAnswer(e)}
                waves="light"
              >
                Confirm Answer: {this.state.answer.move}{" "}
                {this.state.answer.suit}
                <Icon left>done_all</Icon>
              </Button>
            )}
          </div>
        )}

        {this.state.submitted && (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <span className="DisplayArticle-title DisplayQuiz-scoring">
              {this.generateAnswerOutputString()}
              {/*<div style={{position: 'absolute', top: '-4.5rem', right: '0rem'}}>*/}
            </span>
            <div
              onClick={() => this.retryQuiz()}
              style={{
                position: "relative",
                top: "-1rem",
                cursor: "pointer",
                width: "auto",
                marginBottom: "2rem",
              }}
            >
              <Button
                floating
                large
                style={{ backgroundColor: "forestgreen" }}
                waves="light"
              >
                <Icon>undo</Icon>
              </Button>
              <br />
              <span
                style={{
                  position: "relative",
                  left: "-.3rem",
                  top: ".6rem",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  textAlign: "center",
                }}
              >
                Retry Quiz
              </span>
            </div>
            {/*<div style={{position: 'absolute', top: '-2.8rem', right: '1rem',}}>*/}
            {/*<div style={{position: 'relative', top: '-4.5rem',}}>*/}
            {/*</div>*/}
          </div>
        )}

        {this.state.submitted && (
          <div styles={answerStyles}>
            <h5 className="DisplayArticle-title DisplayQuiz-ans">Answer</h5>
            {this.state.quizAnswer}
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  (state) => ({
    uid: state.auth.uid,
    quizScores: state.user.quizScores, // state.auth.quizScores
    quizScoresFetched: state.user.quizScoresFetched,
    currentQuizScore: state.user.currentQuizScore,
    quizzes: state.quizzes.quizzes,
    quiz: state.quizzes.quiz,
    quizMetadata: state.quizzes.currentQuiz,
  }),
  {
    getQuiz,
    getQuizMetadata,
    getUserQuizScore,
    startSubmitUserQuizScore,
    setCurrentQuizScore,
  }
)(DisplayQuiz);
