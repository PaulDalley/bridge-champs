import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../hoc/withRouter";
import {
  startAddQuiz,
  startEditQuiz,
  startDeleteQuiz,
  getQuiz,
} from "../store/actions/quizzesActions";
import {
  Row,
  TextInput,
  Select,
  Button,
  Icon,
  Modal,
  Col,
  DatePicker,
  Textarea,
} from "react-materialize"; // Input component deprecated
import {
  findQuizById,
  replaceSuitMacros,
  prepareArticleString,
} from "../helpers/helpers";
import GenerateBridgeBoard from "../components/BridgeBoard/GenerateBridgeBoard";
import MoveInput from "../components/BridgeBoard/MoveInput";

import RichTextEditor from "react-rte";
import "./CreateQuiz.css";
import $ from "jquery";
// import QuizAnswerInputs from "../components/Quizzes/QuizAnswerInputs";

// ## quizType:
// 1. bidding: 1 bid choice in set { BiddingGrid.js options }
//  - multiple bid choices input + scoring value
// 2. defence: 1 card from current hand to play next
//  - multiple card choices input + scoring value
// 3. declaring:
// - as defence

class CreateQuiz extends Component {
  state = {
    date: "",
    quizQuestion: "",
    quizAnswer: RichTextEditor.createEmptyValue(),
    quizType: "Bidding",
    teaser: "",
    teaser_board: "",
    title: "",
    answers: [],
    numAnswers: 1,
    edit: false,
    difficulty: "",
  };

  componentDidMount() {
    if (!this.props.a) this.props.history.push(`/quizzes`);

    if (this.props.edit) {
      let quizMetadata = findQuizById(
        this.props.quizzes,
        this.props.match.params.id
      );
      let quizId = this.props.match.params.id;
      if (quizMetadata !== undefined) {
        let {
          body,
          createdAt,
          date,
          quizType,
          teaser,
          teaser_board,
          title,
          difficulty,
        } = quizMetadata;
        if (difficulty === undefined) difficulty = "";
        this.setState({
          numAnswers: 0,
          body,
          createdAt,
          date,
          quizType,
          teaser,
          teaser_board,
          title,
          quizId,
          difficulty,
        });

        this.props.getQuiz(body);
      } else {
        this.props.history.push("/quizzes");
      }
    }
  }

  resetDate = (e) => {
    e.preventDefault();
    this.setState({ date: "" });
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log("COMPONENT JUST UPDATED")
    // console.log(this.state.body);
    // console.log(this.props.article);
    let quizBody;
    if (!this.state.quizLoaded) quizBody = this.props.quiz[this.state.body];
    if (quizBody && !this.state.quizLoaded) {
      // console.log(quizBody.answers);
      this.setState({
        quizLoaded: true,
        edit: true,
        // article: RichTextEditor.createValueFromString(articleBody.text, 'html')
        quizQuestion: quizBody.question,
        answers: quizBody.answers,
        quizAnswer: quizBody.answer,
      });
      // date: "",
      //     quizQuestion: "",
      //     quizAnswer: RichTextEditor.createEmptyValue(),
      //     answers: [],
      //     numAnswers: '1'
    }
  }

  handleChange = (e) => {
    let newAnswers;
    if (
      e.target.name === "numAnswers" &&
      e.target.value < this.state.numAnswers
    ) {
      newAnswers = this.state.answers.slice(0, e.target.value);
      this.setState({ numAnswers: e.target.value, answers: newAnswers });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  quizAnswerChange = (content) => {
    this.setState({ quizAnswer: content });
  };

  changeAnswers = (e, i, key) => {
    // console.log("--- VALUES IN changeAnswers ---");
    // console.log(e);
    // console.log(e.target.value);
    // console.log(i);
    // console.log(key);

    let updatedAnswers = this.state.answers.slice(
      0,
      Number(this.state.numAnswers)
    );
    let changedAnswer = { ...this.state.answers[i] };
    changedAnswer[key] = e.target.value;
    updatedAnswers[i] = changedAnswer;
    // console.log(updatedAnswers);
    this.setState({ answers: updatedAnswers });
  };

  submitQuiz = (e) => {
    e.preventDefault();
    let quiz = {
      title: this.state.title,
      teaser_board: this.state.teaser_board,
      teaser: this.state.teaser,
      date: new Date(this.state.date),
      quizType: this.state.quizType,
      difficulty: this.state.difficulty,
    };

    let quizAnswer = prepareArticleString(
      this.state.quizAnswer.toString("html")
    );
    // .split("&gt;").join('>')
    // .split("&lt;").join('<')
    // .split(' ♦').join(`<span className='red-suit'>&nbsp;♦</span>`)
    // .split(' ♥').join(`<span className='red-suit'>&nbsp;♥</span>`)
    // .split('♦ ').join(`<span className='red-suit'>♦&nbsp;</span>`)
    // .split(/♦[.]?/).join(`<span className='red-suit'>♦&nbsp;</span>`)
    // .split('♥ ').join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split(/♥[.]?/).join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split('♦').join(`<span className='red-suit'>♦</span>`)
    // .split('♥').join(`<span className='red-suit'>♥</span>`)
    // .split(/(![shcd])/)
    // .map(substr => replaceSuitMacros(substr))
    // .join("");

    let quizBody = {
      question: this.state.quizQuestion,
      answer: quizAnswer,
      answers: this.state.answers,
    };

    this.props.addQuiz(quiz, quizBody);
    this.props.history.push("/quizzes");
  };

  submitEditQuiz = (e) => {
    e.preventDefault();
    // console.log(typeof this.state.date);
    // console.log(this.state.date);
    // console.log(this.state.date.toDate());
    // console.log(typeof this.state.date.toDate());
    // return;

    let quiz = {
      title: this.state.title,
      teaser_board: this.state.teaser_board,
      teaser: this.state.teaser,
      date: this.state.date.toDate(), //new Date(this.state.date),
      quizType: this.state.quizType,
      id: this.state.quizId,
      body: this.state.body,
      difficulty: this.state.difficulty,
    };

    let quizAnswer = prepareArticleString(this.state.quizAnswer);
    // .split("&gt;").join('>')
    // .split("&lt;").join('<')
    // .split(' ♦').join(`<span className='red-suit'>&nbsp;♦</span>`)
    // .split(' ♥').join(`<span className='red-suit'>&nbsp;♥</span>`)
    // // .split('♦ ').join(`<span className='red-suit'>♦&nbsp;</span>`)
    // .split(/♦[.]?/).join(`<span className='red-suit'>♦&nbsp;</span>`)
    // // .split('♥ ').join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split(/♥[.]?/).join(`<span className='red-suit'>♥&nbsp;</span>`)
    // .split(/(![shcd])/)
    // .map(substr => replaceSuitMacros(substr))
    // .join("");

    let quizBody = {
      question: this.state.quizQuestion,
      answer: quizAnswer,
      answers: this.state.answers,
    };

    this.props.editQuiz(quiz, quizBody);
    this.props.history.push("/quizzes");
  };

  submitDeleteQuiz = (e) => {
    e.preventDefault();
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    this.props.deleteQuiz(this.state.quizId, this.state.body);
    this.props.history.push(`/quizzes`);
  };

  submitDeleteQuiz = (e) => {
    e.preventDefault();
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    this.props.deleteQuiz(this.state.quizId, this.state.body);
    this.props.history.push(`/quizzes`);
  };

  onInputDateChange = (date) => {
    // console.log("--- Input Date Changed ---");
    // console.log(date);

    this.setState({ date });
  };

  generateAnswerInput = () => {
    const { numAnswers } = this.state;
    let ans = [];
    for (let i = 0; i < numAnswers; i++) ans.push(i);
    let input;
    input = (
      <Row>
        {ans.map((i) => (
          <MoveInput key={i} i={i} moveChanges={this.changeAnswers} />
        ))}
      </Row>
    );
    // 1♣/1♦/1♥/1♠/1NT
    return (
      <div>
        <Row>
          <p className="CreateQuiz-quiz_answer_header">Input Quiz Answers</p>
          <Select
            s={2}
            name="numAnswers"
            type="select"
            label="#"
            value={this.state.numAnswers}
            onChange={this.handleChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Row>
        {input}
      </div>
    );
  };

  editAnswerInputs = () => {
    const numAnswers = this.state.answers.length;
    if (numAnswers === 0) return this.generateAnswerInput();
    this.setState({ numAnswers, edit: false });

    const input = (
      <Row>
        {this.state.answers.map((answer, idx) => (
          <MoveInput
            key={idx}
            i={idx}
            move={answer.move}
            score={answer.score}
            suit={answer.suit}
            editing={true}
            moveChanges={this.changeAnswers}
          />
        ))}
      </Row>
    );
    // 1♣/1♦/1♥/1♠/1NT
    return (
      <div>
        <Row>
          <p className="CreateQuiz-quiz_answer_header">Input Quiz Answers</p>
          <Select
            s={2}
            name="numAnswers"
            type="select"
            label="#"
            value={this.state.numAnswers}
            onChange={this.handleChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Row>
        {input}
      </div>
    );
  };

  render() {
    // let AnswerInput = (!this.state.edit) ? this.generateAnswerInput() : this.editAnswerInputs();

    // let AnswerInput = (<div></div>);
    // console.log(this.state.answers);
    // console.log(this.state.quizId);
    // console.log(this.state.body);
    return (
      <div className="CreateArticle-container">
        <form>
          <h3 style={{ paddingTop: "3rem", textAlign: "center" }}>
            {!this.props.edit ? "Create " : "Edit "}Quiz
          </h3>
          <Row>
            <TextInput
              s={12}
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              label="Name this quiz"
            />
          </Row>
          <Row>
            <Select
              s={12}
              name="quizType"
              type="select"
              label="Quiz Type"
              value={this.state.quizType}
              onChange={this.handleChange}
            >
              <option value="Bidding">Bidding</option>
              <option value="Opening Lead">Opening Lead</option>
              <option value="Defence">Defence</option>
              <option value="Declaring">Declaring</option>
            </Select>
          </Row>
          <Row>
            <Select
              s={12}
              name="difficulty"
              type="select"
              label="Quiz Difficulty"
              value={this.state.difficulty}
              onChange={this.handleChange}
            >
              <option value='""'></option>
              <option value="general">General</option>
              <option value="beg">Beginner</option>
              <option value="int">Intermediate</option>
              <option value="adv">Advanced</option>
            </Select>
          </Row>
          <Row>
            {this.state.date === "" && (
              <DatePicker
                name="date"
                //    type='date'
                label="Select Quiz Date"
                onChange={(e, value) => {
                  this.onInputDateChange(e, value);
                }}
              />
            )}
            {/* 0,11 -> Wed Mar 23;  0,16 -> Wed Mar 23 2023 */}
            {this.state.date !== "" && this.state?.date?.toString && (
              <Col>{this.state.date.toString().slice(0, 16)}</Col>
            )}
            {this.state.date !== "" && (
              <Col>
                <Button
                  waves="light"
                  onClick={(e) => this.resetDate(e)}
                  className="CreateArticle-delete"
                >
                  Reset Date
                  <Icon left>refresh</Icon>
                </Button>
              </Col>
            )}
          </Row>
          <Row>
            <GenerateBridgeBoard />
          </Row>
          <Row>
            <TextInput
              s={12}
              name="teaser_board"
              label="Quiz Teaser Hand (Paste a board for the quiz list page)"
              value={this.state.teaser_board}
              onChange={this.handleChange}
            ></TextInput>
          </Row>
          <Row>
            <TextInput
              s={12}
              name="teaser"
              label="Quiz Teaser Introduction (IMPORTANT: MAKE SURE TO PASTE THE MAKEBOARD BOARD)"
              // type="textarea"
              value={this.state.teaser}
              onChange={this.handleChange}
            ></TextInput>
          </Row>
          <Row>
            <Textarea
              s={12}
              name="quizQuestion"
              label="Quiz Question"
              //    type="textarea"
              value={this.state.quizQuestion}
              onChange={this.handleChange}
              style={{ fontSize: "2.2rem" }}
            ></Textarea>
          </Row>
          <Row>
            {/*{ AnswerInput }*/}
            {!this.state.edit
              ? this.generateAnswerInput()
              : this.editAnswerInputs()}
          </Row>
          <Row>
            {/*<QuizAnswerInputs*/}
            {/*// edit={this.state.edit}*/}
            {/*edit={true}*/}
            {/*answers={this.state.answers}/>*/}
          </Row>
          <Row>
            {!this.props.edit && (
              <RichTextEditor
                value={this.state.quizAnswer}
                onChange={this.quizAnswerChange}
                className="editor"
              />
            )}
            {this.props.edit && this.state.quizLoaded && (
              <Textarea
                s={12}
                name="quizAnswer"
                label="Enter Quiz Answer"
                //    type="textarea"
                value={this.state.quizAnswer}
                onChange={this.handleChange}
                style={{ fontSize: "2.2rem" }}
              />
            )}
          </Row>

          {!this.props.edit && (
            <Button
              className="CreateArticle-submit"
              onClick={(e) => this.submitQuiz(e)}
              waves="light"
            >
              Submit Quiz
              <Icon left>done_all</Icon>
            </Button>
          )}
          {this.props.edit && (
            <Button
              className="CreateArticle-edit"
              onClick={(e) => this.submitEditQuiz(e)}
              waves="light"
            >
              Edit Quiz
              <Icon left>done_all</Icon>
            </Button>
          )}

          {this.props.edit && (
            <Modal
              header="Confirm Deletion"
              trigger={
                <Button waves="light" className="CreateArticle-delete">
                  Delete Quiz
                  <Icon left> delete</Icon>
                </Button>
              }
            >
              <br />
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Are you sure you want to delete?
              </p>
              <br />
              <br />
              <Button
                waves="light"
                className="CreateArticle-delete"
                onClick={(e) => this.submitDeleteQuiz(e)}
              >
                Delete Quiz
                <Icon left> delete</Icon>
              </Button>
            </Modal>
          )}
        </form>
      </div>
    );
  }
}
const mapStateToProps = ({ auth, quizzes }) => ({
  a: auth.a,
  quizzes: quizzes.quizzes,
  quiz: quizzes.quiz,
});
const mapDispatchToProps = (dispatch) => ({
  addQuiz: (quiz, quizBody) => dispatch(startAddQuiz(quiz, quizBody)),
  editQuiz: (quiz, quizBody) => dispatch(startEditQuiz(quiz, quizBody)),
  deleteQuiz: (quizId, bodyId) => dispatch(startDeleteQuiz(quizId, bodyId)),
  getQuiz: (id) => dispatch(getQuiz(id)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateQuiz)
);
