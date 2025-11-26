import React, { Component } from "react";
import GenerateBridgeBoardClient from "./GenerateBridgeBoardClient";
import AnimatedButton from "../UI/AnimatedButton";
import { Row, Textarea } from "react-materialize"; // Input deprecated

class AskQuestion extends Component {
  state = {
    hide: true,
    // title: "",
    body: "",
    board: `<MakeBoard boardType=single position=North North=*S-*H-*D-*C- East=*S-*H-*D-*C- South=*S-*H-*D-*C- West=*S-*H-*D-*C- vuln=Nil Vul dealer=North bidding=_ />`,
  };

  componentDidMount() {
    this.setState({
      generateBridgeBoardClient: (
        <GenerateBridgeBoardClient updateBoard={this.handleBoardChange} />
      ),
    });
  }

  // shouldComponentUpdate(nextProps) {
  //     // console.log(nextProps);
  //     // console.log(nextProps.board !== this.state.board);
  //     return nextProps.board !== this.state.board;
  // }
  //
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleBoardChange = (board) => {
    // console.log(board);
    if (this.state.board !== board) {
      this.setState({ board });
    }
  };

  submitQuestion = () => {
    if (this.props.uid === undefined) return;
    const { board, body } = this.state;
    this.props.submitQuestion({
      board,
      body,
      uid: this.props.uid,
    });
  };

  render() {
    const displayFormClass = this.state.hide
      ? "Questions-AskQuestionForm_container_hide"
      : "Questions-AskQuestionForm_container_show";
    const containerClass = this.state.hide
      ? "Questions-AskQuestion_container_hidden"
      : "Questions-AskQuestion_container";
    return (
      <div className={`${containerClass}`}>
        {this.state.hide && (
          <AnimatedButton
            style={{ margin: "2.5rem" }}
            jumpTo=""
            buttonText="Ask a Question"
            color="green" // "white"
            whenClicked={() => this.setState({ hide: false })}
            // scrollTo="#HomePage-Start"
          />
        )}
        <br />

        {!this.state.hide && (
          <div
            className="Questions-AskQuestion_close"
            onClick={() => this.setState({ hide: true })}
          >
            <i className="fas fa-times"></i>
          </div>
        )}

        <div
          className={`Questions-AskQuestionForm_container ${displayFormClass}`}
        >
          <p className="Questions-AskQuestion_header Questions-AskQuestion_header_top">
            Ask a Question:
          </p>
          {/*<Row>*/}
          {/*<Input s={6}*/}
          {/*name="title"*/}
          {/*onChange={this.handleChange}*/}
          {/*value={this.state.title}*/}
          {/*label="Question title"*/}
          {/*style={{fontSize: '2.2rem'}}*/}
          {/*/>*/}
          {/*</Row>*/}
          <Row>
            <Textarea
              s={8}
              name="body"
              label=""
              //    type="textarea"
              value={this.state.question}
              onChange={this.handleChange}
              style={{ fontSize: "2.2rem" }}
            ></Textarea>
          </Row>
          <p className="Questions-AskQuestion_header">Describe the hand:</p>
          {this.state.generateBridgeBoardClient}

          <div className="Questions_submit-question-button">
            {this.props.uid && (
              <AnimatedButton
                style={{ margin: "2.5rem" }}
                jumpTo=""
                buttonText="Submit Question"
                color="green" // "white"
                whenClicked={() => this.submitQuestion()}
                // scrollTo="#HomePage-Start"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AskQuestion;
