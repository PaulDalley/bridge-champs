import React, { Component } from "react";
import {
  Collapsible,
  CollapsibleItem,
  Row,
  Col,
  Input,
  Button,
  Icon,
} from "react-materialize";
import Hand from "../BridgeBoard/Hand";
import Bidding from "../BridgeBoard/Bidding";
import MakeBoard from "../BridgeBoard/MakeBoard";
// import BiddingGrid from '../BridgeBoard/BiddingGrid';
import "./GenerateBridgeBoardClient.css";
import {
  sortCardString,
  noDuplicateCardsOfSameSuit,
} from "../../helpers/helpers";
import toastr from "toastr";

class GenerateBridgeBoardClient extends Component {
  handClicked = (hand) => {
    // console.log(hand);
  };

  countCards = (hand) => {
    return (
      hand.spades.length +
      hand.clubs.length +
      hand.diamonds.length +
      hand.hearts.length
    );
  };

  handleHandInputChanged = (position, suit, cards) => {
    // console.log(position);
    // console.log(suit);
    cards = sortCardString(cards);
    const newHand = {
      North: { ...this.state.hand.North },
      South: { ...this.state.hand.South },
      East: { ...this.state.hand.East },
      West: { ...this.state.hand.West },
    };

    newHand[position][suit] = cards;
    newHand[position]["numCards"] = this.countCards(newHand[position]);

    if (newHand[position]["numCards"] > 13) {
      toastr.error("A hand can have 13 cards maximum!");
      return;
    }

    // console.log(newHand);
    let OK = noDuplicateCardsOfSameSuit(
      newHand["North"],
      newHand["East"],
      newHand["South"],
      newHand["West"],
      suit
    );
    // console.log(OK);
    if (!OK) {
      toastr.error("2 hands cannot have the same card!");
      // this.setState({ doRerender: true });
      return;
    }

    // let currentFilters = this.state.filters[suit];
    // let flag = cards.split("").
    //     map(card => currentFilters.includes(card)).
    //     some(bool => bool);
    // console.log(flag);
    // if (flag) {
    //     toastr.error("2 hands cannot have the same card!");
    //     return;
    // }
    // console.log("GOT HERE");
    // console.log(newHand);
    this.setState({ hand: newHand });
  };

  state = {
    // doRerender: true,
    biddingGrid: ["_"],
    bidding: ["_"],
    currentMaxBid: "0♣",
    vuln: "Nil Vul",
    dealer: "North",
    boardType: "single",
    posForAll: "North",
    singleHand: "North",
    doubleHand: "North/South",
    generatedOutput: "",
    hand: {
      North: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      South: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      East: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      West: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
    },
  };
  // shouldComponentUpdate() {
  //     console.log(this.state.doRerender);
  //     return this.state.doRerender;
  // }

  componentDidMount() {
    this.setState({
      // biddingGridJSX: <Bidding vuln={this.state.vuln}
      //                          dealer={this.state.dealer}
      //                          editable={true}
      //                          updateBiddingGrid={this.biddingGridUpdated}
      //                          makingBoard={false}
      //                          biddingClass="GenerateBridgeBoardClient-bidding"
      //                          biddingGridClass="GenerateBridgeBoardClient-biddingGrid"
      // />,
      resetGrid: (
        <Button
          className="GenerateBridgeBoard-button--danger"
          onClick={(e) => this.resetBoards(e)}
          waves="light"
          style={{ position: "relative", top: "-3.7rem" }}
        >
          Reset Board
          <Icon left>warning</Icon>
        </Button>
      ),
      // boardTypeInput: <Input s={2}
      //                        className="GenerateBridgeBoard-select_board_type GenerateBridgeBoardClient-input"
      //                        name="boardType"
      //                        type="select"
      //                        label="Select Board Type:"
      //                        value={this.state.boardType}
      //                        onChange={(e) => this.changeBoardType(e)}
      // >
      //     <option value='single'>Single</option>
      //     <option value='double'>Double</option>
      //     <option value='full'>Full</option>
      // </Input>,
      setVulnerabilities: (
        <Select
          s={3}
          className="GenerateBridgeBoardClient-input"
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
      ),
      setDealer: (
        <Select
          s={3}
          className="GenerateBridgeBoardClient-input"
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
      ),
    });
  }

  biddingGridUpdated = (data) => {
    this.setState({ biddingGrid: data });
  };

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

  // shouldComponentUpdate() {
  //     return false;
  // }

  makeHand = () => {
    // if (!this.state.doRerender) return;
    // if (this.state.boardObj) {
    //     return this.state.boardObj;
    // }
    let { boardType, hand, vuln, dealer, biddingGrid, posForAll } = this.state;
    // let bidding = biddingGrid.join('/');

    // switch(boardType) {
    //     case 'single':
    //         position = this.state.singleHand;
    //         break;
    //     case 'double':
    //         position = this.state.doubleHand;
    //         break;
    //     case 'full':
    //         position = 'full';
    //         break
    // }
    // console.log(hand.North);
    // console.log(hand.South);

    let North = this.genStringFromBoard(hand.North);
    let South = this.genStringFromBoard(hand.South);
    let East = this.genStringFromBoard(hand.East);
    let West = this.genStringFromBoard(hand.West);
    // console.log(North);
    // console.log(South);
    // console.log(East);
    // console.log(West);
    let position;
    switch (boardType) {
      case "full":
        position = "full";
        break;
      case "single":
        position = this.state.singleHand;
        break;
      case "double":
        position = this.state.doubleHand;
        break;
    }

    this.props.updateBoard(
      `<MakeBoard boardType=${boardType} position=${position} North=${North} East=${East} South=${South} West=${West} vuln=${vuln} dealer=${dealer} bidding=${biddingGrid.join(
        "/"
      )} />`
    );

    // this.setState({ boardObj: <MakeBoard hideBidding={true}
    //                                      boardType={'full'}
    //                                      position={posForAll}
    //                                      North={North} East={East} South={South} West={West}
    //                                      handClickhandler={this.handClicked}
    //                                      handInputHandler={this.handleHandInputChanged}
    //                                      inputBoard={true}
    //                                      vuln={vuln}
    //                                      dealer={dealer}
    //                                      bidding={biddingGrid} /> });
    return (
      <MakeBoard
        hideBidding={true}
        boardType={"full"}
        position={posForAll}
        North={North}
        East={East}
        South={South}
        West={West}
        handClickhandler={this.handClicked}
        handInputHandler={this.handleHandInputChanged}
        inputBoard={true}
        vuln={vuln}
        dealer={dealer}
        bidding={biddingGrid}
      />
    );
  };

  genStringFromBoard = (board) => {
    let s = "";
    s += "*S-" + board.spades.replace("T", "10");
    s += "*H-" + board.hearts.replace("T", "10");
    s += "*D-" + board.diamonds.replace("T", "10");
    s += "*C-" + board.clubs.replace("T", "10");
    return s;
  };

  // BiddingGridClicked = (i, suit) => {
  //     // console.log(i, suit);
  //     // console.log(i === "P");
  //     const answers = this.props.quiz[this.props.match.params.id].answers;
  //     // console.log(answers);
  //     this.setState({answer: {move: i, suit}});
  // };

  resetBoards = (e) => {
    e.preventDefault();
    let resetHand = {
      North: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      South: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      East: {
        numCards: 0,
        spades: "",
        diamonds: "",
        clubs: "",
        hearts: "",
      },
      West: {
        numCards: 0,
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
    if (e.target.name === "boardType" && e.target.value === "single") {
      this.setState({
        boardType: "single",
        posForAll: "North",
        singleHand: "North",
        doubleHand: "North/South",
      });
    } else if (e.target.name === "boardType" && e.target.value === "double") {
      this.setState({
        [e.target.name]: e.target.value,
        posForAll: "North/South",
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
        posForAll: e.target.value,
      });
    }

    // this.resetBoards(e);
  };

  generateInputsForBoard = (positions) => {
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const suitsMapper = { spades: "♠", clubs: "♣", hearts: "♥", diamonds: "♦" };
    let { hand } = this.state;
    const styles = [
      "GenerateBridgeBoardClient-input_north",
      "GenerateBridgeBoardClient-input_south",
      "GenerateBridgeBoardClient-input_east",
      "GenerateBridgeBoardClient-input_west",
    ];

    let board = positions.map((position, idx) => {
      // let symbol = suitsMapper[position];
      return (
        <div className={styles[idx]} key={position}>
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
        </div>
      );
    });
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
          {/*<Col>*/}
          {/*<Hand position={position}*/}
          {/*spades={hand[position].spades}*/}
          {/*hearts={hand[position].hearts}*/}
          {/*diamonds={hand[position].diamonds}*/}
          {/*clubs={hand[position].clubs}/>*/}
          {/*</Col>*/}
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

  // doRenderBiddingGrid() {
  //     if (this.state.doRerenderBiddingGrid) {
  //         let newBiddingGrid =
  //         <Bidding vuln={this.state.vuln}
  //                  dealer={this.state.dealer}
  //                  editable={true}
  //                  updateBiddingGrid={this.biddingGridUpdated}
  //                  makingBoard={false}
  //                  biddingClass="GenerateBridgeBoardClient-bidding"
  //                  biddingGridClass="GenerateBridgeBoardClient-biddingGrid"
  //         />;
  //         // this.setState({ biddingGridJSX: newBiddingGrid, doRerender: false, });
  //         return newBiddingGrid;
  //     } else {
  //         return this.state.biddingGridJSX;
  //     }
  // }

  render() {
    const { boardType } = this.state;
    let positionInput;
    let boardInputs;

    switch (boardType) {
      case "single":
        boardInputs = this.generateInputsForBoard([this.state.singleHand]);
        positionInput = (
          <Select
            s={3}
            className="GenerateBridgeBoardClient-input"
            name="singleHand"
            // type="select"
            label="Position"
            value={this.state.singleHand}
            onChange={(e) => this.changeBoardType(e)}
          >
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </Select>
        );
        break;
      case "double":
        let [left, right] = this.state.doubleHand.split("/");
        boardInputs = this.generateInputsForBoard([left, right]);
        positionInput = (
          <Select
            s={3}
            className="GenerateBridgeBoardClient-input"
            name="doubleHand"
            // type="select"
            label="Positions"
            value={this.state.doubleHand}
            onChange={(e) => this.changeBoardType(e)}
          >
            <option value="North/South">North/South</option>
            <option value="North/East">North/East</option>
            <option value="North/West">North/West</option>
          </Select>
        );
        break;

      case "full":
        boardInputs = this.generateInputsForBoard([
          "North",
          "South",
          "East",
          "West",
        ]);
        // board = (
        //     <div className="GenerateBridgeBoard-full-board_container">
        //         { this.makeAnInputBoard(["North", "South", "East", "West"], true)}
        //     </div>);
        break;
    }

    return (
      <div className="GenerateBridgeBoardClient-container">
        {/*<Collapsible popout>*/}
        {/*<CollapsibleItem header='Create Hand' icon='add_circle'>*/}
        <Row>
          {/*{this.state.boardTypeInput}*/}
          <Select
            s={3}
            className="GenerateBridgeBoard-select_board_type GenerateBridgeBoardClient-input"
            name="boardType"
            type="select"
            label="Select Board Type:"
            value={this.state.boardType}
            onChange={(e) => this.changeBoardType(e)}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="full">Full</option>
          </Select>

          {positionInput}

          {/*<Input s={2}*/}
          {/*className="GenerateBridgeBoardClient-input"*/}
          {/*name="dealer"*/}
          {/*type="select"*/}
          {/*label="Set Dealer"*/}
          {/*value={this.state.dealer}*/}
          {/*onChange={(e) => this.setVulnDealer(e)}*/}
          {/*>*/}
          {/*<option value='North'>North</option>*/}
          {/*<option value='South'>South</option>*/}
          {/*<option value='East'>East</option>*/}
          {/*<option value='West'>West</option>*/}
          {/*</Input>*/}
          {this.state.setDealer}

          {this.state.setVulnerabilities}
          {/*<Input s={2}*/}
          {/*className="GenerateBridgeBoardClient-input"*/}
          {/*name="vuln"*/}
          {/*type="select"*/}
          {/*label="Set Vulnerabilities"*/}
          {/*value={this.state.vuln}*/}
          {/*onChange={(e) => this.setVulnDealer(e)}*/}
          {/*>*/}
          {/*<option value='Nil Vul'>Nil Vul</option>*/}
          {/*<option value='Vul East/West'>Vul East/West</option>*/}
          {/*<option value='Vul North/South'>Vul North/South</option>*/}
          {/*<option value='All Vul'>All Vul</option>*/}
          {/*</Input>*/}
        </Row>

        <Row>
          <div
            style={{
              position: "relative",
              minWidth: "65rem",
              minHeight: "65rem",
              maxWidth: "65rem",
              maxHeight: "65rem",
            }}
          >
            {/*<div className="GenerateBridgeBoardClient-card_count-North">{this.state.hand.North.numCards}/13</div>*/}
            {/*<div className="GenerateBridgeBoardClient-card_count-West">{this.state.hand.West.numCards}/13</div>*/}
            {/*<div className="GenerateBridgeBoardClient-card_count-East">{this.state.hand.South.numCards}/13</div>*/}
            {/*<div className="GenerateBridgeBoardClient-card_count-South">{this.state.hand.East.numCards}/13</div>*/}

            {this.makeHand()}

            {this.state.resetGrid}

            <div className="GenerateBridgeBoardClient-bidding_container">
              <Bidding
                vuln={this.state.vuln}
                dealer={this.state.dealer}
                editable={true}
                updateBiddingGrid={this.biddingGridUpdated}
                makingBoard={false}
                biddingClass="GenerateBridgeBoardClient-bidding"
                biddingGridClass="GenerateBridgeBoardClient-biddingGrid"
              />
            </div>
          </div>
        </Row>
      </div>
    );
  }
}
export default GenerateBridgeBoardClient;
