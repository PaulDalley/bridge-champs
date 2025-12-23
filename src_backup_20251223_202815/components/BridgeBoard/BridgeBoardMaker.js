import React, { Component } from "react";
import { Button, Row, Col, Icon, TextInput } from "react-materialize"; // Input component deprecated
import Hand from "./Hand";
import BridgeHandmaker from "./BridgeHandmaker";
// import './BridgeBoardmaker.css';

class BridgeBoardmaker extends Component {
  state = {
    North: "",
    South: "",
    East: "",
    West: "",
    generatedOutput: "",
  };

  handleChange = (data) => {
    const { position, ...newBoard } = data;
    this.setState({ [position]: newBoard }); //, () => {
    //     this.props.passBoardUp({
    //         boardType: this.props.boardType,
    //         ...this.state
    //     });
    // });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.position === nextProps.position;
  }

  getBoardFromChild = (e) => {
    this.handleChange(e);
  };

  resetBoards = (e) => {
    e.preventDefault();
    this.generateHandMaker(this.props.boardType);
  };

  generateHandMaker = (boardType) => {
    let hand;
    // console.log(boardType);
    switch (boardType) {
      case "single":
        hand = (
          <div>
            <BridgeHandmaker
              className="GenerateBridgeBoard-single"
              spades=""
              hearts=""
              diamonds=""
              clubs=""
              position={this.props.position}
              passBoardUp={this.getBoardFromChild}
            />
            <Row>
              <Button
                className="GenerateBridgeBoard-button"
                onClick={(e) => this.generateHand(e)}
                waves="light"
              >
                Generate Hand
                <Icon left>add</Icon>
              </Button>
            </Row>
            <Row>
              <TextInput
                s={12}
                name="generatedOutput"
                value={this.state.generatedOutput}
                label="Generated Output"
              />
            </Row>
            {/*<Button className="GenerateBridgeBoard-button--danger"*/}
            {/*onClick={this.resetBoards}*/}
            {/*waves='light'>Reset Board*/}
            {/*<Icon left>warning</Icon>*/}
            {/*</Button>*/}
          </div>
        );
        break;
      case "double":
        let [left, right] = this.props.position.split("/");
        hand = (
          <div>
            <BridgeHandmaker
              className="GenerateBridgeBoard-single"
              position={left}
              passBoardUp={this.getBoardFromChild}
            />
            <BridgeHandmaker
              className="GenerateBridgeBoard-single"
              position={right}
              passBoardUp={this.getBoardFromChild}
            />
            <Row>
              <Button
                className="GenerateBridgeBoard-button"
                onClick={(e) => this.generateHand(e)}
                waves="light"
              >
                Generate Hand
                <Icon left>add</Icon>
              </Button>
            </Row>
            <Row>
              <TextInput
                s={12}
                name="generatedOutput"
                value={this.state.generatedOutput}
                label="Generated Output"
              />
            </Row>
            {/*<Button className="GenerateBridgeBoard-button--danger"*/}
            {/*onClick={this.resetBoards}*/}
            {/*waves='light'>Reset Boards*/}
            {/*<Icon left>warning</Icon>*/}
            {/*</Button>*/}
          </div>
        );
        break;
      case "full":
        hand = (
          <div>
            <BridgeHandmaker
              className="GenerateBridgeBoard-single"
              position="North"
              passBoardUp={this.getBoardFromChild}
            />
            <BridgeHandmaker
              className="GenerateBridgeBoard-left"
              position="West"
              passBoardUp={this.getBoardFromChild}
            />
            <BridgeHandmaker
              className="GenerateBridgeBoard-right"
              position="East"
              passBoardUp={this.getBoardFromChild}
            />
            <BridgeHandmaker
              className="GenerateBridgeBoard-single"
              position="South"
              passBoardUp={this.getBoardFromChild}
            />
            <Row>
              <Button
                className="GenerateBridgeBoard-button"
                onClick={(e) => this.generateHand(e)}
                waves="light"
              >
                Generate Hand
                <Icon left>add</Icon>
              </Button>
            </Row>
            <Row>
              <TextInput
                s={12}
                name="generatedOutput"
                value={this.state.generatedOutput}
                label="Generated Output"
              />
            </Row>
            {/*<Button className="GenerateBridgeBoard-button--danger"*/}
            {/*onClick={this.resetBoards}*/}
            {/*waves='light'>Reset Boards*/}
            {/*<Icon left>warning</Icon>*/}
            {/*</Button>*/}
          </div>
        );
        break;
    }
    return hand;
  };

  render() {
    // console.log("RERENDERING BRIDGEBOARDMAKER");
    const { position, boardType } = this.props;
    const { North, South, East, West } = this.state;
    let hand = this.generateHandMaker(boardType);

    return <div>{hand}</div>;
  }
}
export default BridgeBoardmaker;
