import React, { Component } from "react";
import { Row, Select } from "react-materialize";
import MoveInput from "../BridgeBoard/MoveInput";

class QuizAnswerInputs extends Component {
  componentDidMount() {
    console.log(this.props.edit);
    if (this.props.edit) {
      this.setState({ edit: this.props.edit, numAnswers: "0" });
    }
  }

  state = {
    numAnswers: "1",
    answers: [],
    edit: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeAnswers = (e, i, key) => {
    let updatedAnswers = this.state.answers.slice(
      0,
      Number(this.state.numAnswers)
    );
    let changedAnswer = { ...this.state.answers[i] };
    changedAnswer[key] = e.target.value;
    updatedAnswers[i] = changedAnswer;
    this.setState({ answers: updatedAnswers });
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
            //    type='select'
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
    const numAnswers = this.props.answers.length;
    if (numAnswers === 0) return this.generateAnswerInput();
    this.setState({ numAnswers, edit: false });

    const input = (
      <Row>
        {this.props.answers.map((answer, idx) => (
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
            //    type='select'
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
    return (
      <div>
        {!this.state.edit
          ? this.generateAnswerInput()
          : this.editAnswerInputs()}
      </div>
    );
  }
}

export default QuizAnswerInputs;
