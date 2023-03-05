import React, { Component } from "react";
import {
  Collapsible,
  CollapsibleItem,
  Row,
  Col,
  TextInput,
  Button,
  Icon,
  Select,
} from "react-materialize"; // Input component obsolete
// import BridgeBoardMaker from './BridgeBoardMaker';
// import BridgeHandmaker from './BridgeHandmaker';
import Hand from "./Hand";
import Bidding from "./Bidding";

import "./GenerateBridgeBoard.css";

class GenerateBridgeBoard extends Component {
  state = {
    biddingGrid: ["_"],
    vuln: "Nil Vul",
    dealer: "North",
    boardType: "single",
    singleHand: "North",
    doubleHand: "North/South",
    generatedOutput: "",
    hand: {
      North: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      South: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      East: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      West: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
    },
  };

  biddingGridUpdated = (data) => {
    this.setState({ biddingGrid: data });
  };
  // componentDidMount() {
  //     // console.log("mounting");
  //     // // console.log(this.state.boardType);
  //     // console.log(this.state.hand);
  //     let position = "North";
  //     console.log(this.state.hand[position].spades);
  // }

  handleChange = (value, position, suit) => {
    let newHand = { ...this.state.hand };
    let updatedPos = { ...newHand[position] };
    updatedPos[suit] = value.toUpperCase();
    newHand[position] = updatedPos;
    // console.log(updatedPos);
    this.setState({ hand: newHand }); //, () => {
    // console.log(this.state.hand[position][suit]);
    //});
  };

  generateHand = (e) => {
    e.preventDefault();
    this.setState({ generatedOutput: this.makeHand() });
  };

  makeHand = () => {
    let { boardType, hand, vuln, dealer, biddingGrid } = this.state;
    let bidding = biddingGrid.join("/");
    let position;
    switch (boardType) {
      case "single":
        position = this.state.singleHand;
        break;
      case "double":
        position = this.state.doubleHand;
        break;
      case "full":
        position = "full";
        break;
    }
    let North = this.genStringFromBoard(hand.North);
    let South = this.genStringFromBoard(hand.South);
    let East = this.genStringFromBoard(hand.East);
    let West = this.genStringFromBoard(hand.West);
    return `<MakeBoard boardType="${boardType}" position="${position}" North="${North}" East="${East}" South="${South}" West="${West}" vuln="${vuln}" dealer="${dealer}" bidding="${bidding}" />`;
  };

  genStringFromBoard = (board) => {
    let s = "";
    s += "*S-" + board.spades;
    s += "*H-" + board.hearts;
    s += "*D-" + board.diamonds;
    s += "*C-" + board.clubs;
    return s;
  };
  //
  // makeHand = () => {
  //     let {hand, boardType} = this.state;
  //     let s = boardType + '&'
  //     switch(s) {
  //         case 'single':
  //             s += this.state.singleHand;
  //             break;
  //         case 'double':
  //             s += this.state.doubleHand;
  //             break;
  //     }
  //     s += "_N" + this.genStringFromBoard(hand.North);
  //     s += "_E" + this.genStringFromBoard(hand.East);
  //     s += "_S" + this.genStringFromBoard(hand.South);
  //     s += "_W" + this.genStringFromBoard(hand.West);
  //     return `<MakeBoard board="${s}" />`;
  // }

  resetBoards = (e) => {
    e.preventDefault();
    let resetHand = {
      North: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      South: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      East: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      West: {
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
    };
    this.setState({ hand: resetHand, generatedOutput: "" });
  };

  setVulnDealer = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeBoardType = (e) => {
    // this.setState({boardType}, () => console.log(this.state.boardType));
    // console.log(e.target.name);
    // console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
    this.resetBoards(e);
  };

  makeAnInputBoard = (positions, fullboard = false) => {
    const suitsMapper = { spades: "♠", clubs: "♣", hearts: "♥", diamonds: "♦" };
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    let { hand } = this.state;

    let styles = ["", "", "", ""];
    if (fullboard) {
      styles = [
        "fullboard-north",
        "fullboard-south",
        "fullboard-east",
        "fullboard-west",
      ];
    }

    let board = positions.map((position, idx) => {
      // let symbol = suitsMapper[position];
      return (
        <Row className={styles[idx]} key={position}>
          <Col>
            <Hand
              position={position}
              spades={hand[position].spades}
              hearts={hand[position].hearts}
              diamonds={hand[position].diamonds}
              clubs={hand[position].clubs}
            />
          </Col>
          <Col>
            {suits.map((suit) => {
              return (
                <div key={suit} className="BridgeHandmaker-form">
                  <Row className="Hand-row">
                    <TextInput
                      name={position}
                      value={hand[position][suit]}
                      onChange={(e) =>
                        this.handleChange(e.target.value, position, suit)
                      }
                      label={suitsMapper[suit]}
                    />
                  </Row>
                </div>
              );
            })}
          </Col>
        </Row>
      );
    });
    return board;
  };

  render() {
    const { boardType } = this.state;
    let board;

    switch (boardType) {
      case "single":
        board = (
          <div>
            <Row>
              <Select
                s={12}
                name="singleHand"
                //    type="select"
                label="Position"
                value={this.state.singleHand}
                onChange={(e) => this.changeBoardType(e)}
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </Select>
            </Row>
            <div className="GenerateBridgeBoard-single_container">
              {this.makeAnInputBoard([this.state.singleHand])}
            </div>
          </div>
        );
        break;
      case "double":
        let [left, right] = this.state.doubleHand.split("/");
        board = (
          <div>
            <Row>
              <Select
                s={12}
                name="doubleHand"
                //    type="select"
                label="Positions"
                value={this.state.doubleHand}
                onChange={(e) => this.changeBoardType(e)}
              >
                <option value="North/South">North/South</option>
                <option value="North/East">North/East</option>
                <option value="North/West">North/West</option>
              </Select>
            </Row>
            <div className="GenerateBridgeBoard-double_container">
              {this.makeAnInputBoard([left, right])}
            </div>
          </div>
        );
        break;
      case "full":
        board = (
          <div className="GenerateBridgeBoard-full-board_container">
            {this.makeAnInputBoard(["North", "South", "East", "West"], true)}
          </div>
        );
        break;
    }

    return (
      <div>
        <Collapsible popout>
          <CollapsibleItem header="Create Hand" icon={<Icon>add_circle</Icon>}>
            <Select
              s={12}
              className="GenerateBridgeBoard-select_board_type"
              name="boardType"
              //    type="select"
              label="Select Board Type:"
              value={this.state.boardType}
              onChange={(e) => this.changeBoardType(e)}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="full">Full</option>
            </Select>
            <Row>
              <Select
                s={12}
                name="dealer"
                //    type="select"
                label="Set Dealer"
                value={this.state.dealer}
                onChange={(e) => this.setVulnDealer(e)}
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </Select>
            </Row>
            <Row>
              <Select
                s={12}
                name="vuln"
                //    type="select"
                label="Set Vulnerabilities"
                value={this.state.vuln}
                onChange={(e) => this.setVulnDealer(e)}
              >
                <option value="Nil Vul">Nil Vul</option>
                <option value="Vul East/West">Vul East/West</option>
                <option value="Vul North/South">Vul North/South</option>
                <option value="All Vul">All Vul</option>
              </Select>
            </Row>

            <Row>
              <div className="GenerateBridgeBoard-bidding_container">
                <Bidding
                  vuln={this.state.vuln}
                  dealer={this.state.dealer}
                  editable={true}
                  updateBiddingGrid={this.biddingGridUpdated}
                  makingBoard={true}
                />
              </div>
            </Row>

            {board}

            <Row>
              <Button
                className="GenerateBridgeBoard-button"
                onClick={(e) => this.generateHand(e)}
                waves="light"
              >
                Generate Hand
                <Icon left>add</Icon>
              </Button>
              <Button
                className="GenerateBridgeBoard-button--danger"
                onClick={(e) => this.resetBoards(e)}
                waves="light"
              >
                Reset Board
                <Icon left>warning</Icon>
              </Button>
            </Row>
            <Row>
              <TextInput
                s={12}
                placeholder="Generated Output"
                name="generatedOutput"
                value={this.state.generatedOutput}
              />
            </Row>
          </CollapsibleItem>
        </Collapsible>
      </div>
    );
  }
}
export default GenerateBridgeBoard;
