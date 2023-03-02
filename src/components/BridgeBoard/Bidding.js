import React, { Component } from "react";
import { Row, Col, Checkbox } from "react-materialize";
import "./Bidding.css";
import BiddingGrid from "./BiddingGrid";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../../hoc/withRouter";
import { getMaxBidFromBiddingString } from "../../helpers/helpers";

const DealerSpots = {
  West: 0,
  North: 1,
  East: 2,
  South: 3,
};

class Bidding extends Component {
  state = {
    dealer: "",
    nEmpty: 1,
    data: [],
    artificialBidChecked: false,
    currentMaxBid: "0♣",
    // artificialBidText: "",
  };
  // <span className="black-suit">♣</span>
  // <span className="red-suit">♦</span>

  //     shouldComponentUpdate(nextProps, nextState) {
  //         return nextProps.vuln != this.props.vuln || nextProps.dealer !== this.props.dealer;
  //     }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable && this.state.dealer !== nextProps.dealer) {
      let nextData = this.state.data.slice(this.state.nEmpty);
      let emptySlots;
      let nEmptySlots = 0;
      switch (nextProps.dealer) {
        case "West":
          emptySlots = [];
          break;
        case "North":
          emptySlots = ["_"];
          nEmptySlots = 1;
          break;
        case "East":
          emptySlots = ["_", "_"];
          nEmptySlots = 2;
          break;
        case "South":
          emptySlots = ["_", "_", "_"];
          nEmptySlots = 3;
          break;
      }
      const updatedData = emptySlots.concat(nextData);
      this.setState({
        data: updatedData,
        nEmpty: nEmptySlots,
        dealer: nextProps.dealer,
      });
      this.props.updateBiddingGrid(updatedData);
    }
  }

  //     shouldComponentUpdate(nextProps) {
  //         return nextProps.dealer !== this.state.dealer;
  //     }

  componentDidMount() {
    // this.setState({ dealer: this.props.dealer });
    // console.log(this.props);
    // console.log(this.props.match.path.includes('/quiz'));
    this.setInitialState(this.props.dealer);
    // console.log(this.props.dealer);
  }

  setInitialState = (dealer) => {
    // if (this.state.dealer === dealer) return;
    let { editable } = this.props;
    this.setState({ dealer });

    let data;
    if (editable) {
      switch (dealer) {
        // case 'West':
        //     break;
        case "North":
          // data = ["_", "", "", ""];
          data = ["_"];
          break;
        case "East":
          data = ["_", "_"];
          break;
        case "South":
          data = ["_", "_", "_"];
          break;
      }
      this.setState({ data });
    } else {
      if (this.props.bidding === undefined || this.props.bidding === "") return;
      // console.log(this.props);

      if (typeof this.props.bidding === "string") {
        data = this.props.bidding.split("/");
      }
      if (this.props.bidding instanceof Array) {
        data = this.props.bidding;
      }

      let index = data.length - 1;
      let currentMaxBid;
      do {
        currentMaxBid = data[index];
        index--;
      } while (
        data[index + 1] === "P" ||
        data[index + 1] === "X" ||
        data[index + 1] === "XX"
      );
      this.setState({ data, currentMaxBid });
      if (this.props.isQuiz) {
        this.props.getBidding(data, currentMaxBid);
      }
    }
  };

  artificialBidCheckboxChanged = (e) => {
    // e.preventDefault();
    // console.log(e.target.checked);
    // this.setState(prevState => ({artificialBidChecked: !prevState.artificialBidChecked}));
    this.setState({ artificialBidChecked: e.target.checked });
  };

  BiddingGridClicked = (i, suit) => {
    let data = [...this.state.data];
    let artificialBidMarker = this.state?.artificialBidChecked ? "*" : "";
    if (suit) {
      data.push(artificialBidMarker + i + suit); //+ '-' + this.state.artificialBidText);
      this.setState({ data, currentMaxBid: i + suit }, () => {
        this.props.updateBiddingGrid(data);
      });
    } else {
      data.push(artificialBidMarker + i); // + '-' + this.state.artificialBidText);
      this.setState({ data }, () => {
        this.props.updateBiddingGrid(data);
      });
    }
    // this.setState({ data, }, () => {
    //     this.props.updateBiddingGrid(data);
    // });
  };

  resetToIdx = (idx) => {
    // console.log("BEFORE");
    // console.log(this.state.data);

    // const sliceFrom = Math.min(idx, DealerSpots[this.state.dealer]);

    let dealerSpots = this.state.data.slice(0, DealerSpots[this.state.dealer]);
    let keptBids = this.state.data.slice(DealerSpots[this.state.dealer], idx);

    // let data = this.state.data.slice(0, idx);
    let data = [...dealerSpots, ...keptBids];

    const newMaxBid = getMaxBidFromBiddingString([...data]);
    // const countNumPasses
    // console.log("AFTER");
    // console.log(data);

    // console.log("OLD MAX BID: " + this.state.currentMaxBid);

    this.setState({ data, currentMaxBid: newMaxBid }, () => {
      this.props.updateBiddingGrid(data);
      // console.log("NEW MAX BID");
      // console.log(this.state.currentMaxBid);
    });
  };

  getSuitStyles = (suit) => {
    let styles = "";
    if (suit) {
      switch (suit) {
        case "♥":
        case "♦":
          styles = "red-suit red-suit-bidding";
          break;
        case "♣":
        case "♠":
        case "N":
        case "P":
        case "X":
        case "XX":
          styles = "black-suit black-suit-bidding";
          break;
        case "NT":
          styles = "Bidding-NoTrump Bidding-NoTrump-bidding";
          // styles = "black-suit";
          break;
      }
    }
    return styles;
  };

  getArtificialBidClass = (artificialBid) => {
    return artificialBid ? "Bidding-entry-artificial" : "";
  };

  // initializeTooltips = () => {
  //     $(document).ready(() => {
  //         $('.tooltipped').tooltip({delay: 50});
  //     });
  // }

  render() {
    // console.log("CURRENT BIDDING GRID DATA");
    // console.log(this.state.data);

    let { vuln, dealer, editable } = this.props;
    let positions = ["North", "South", "East", "West"];
    let classNames = {};
    switch (vuln) {
      case "Nil Vul":
        positions.forEach((pos) => {
          classNames[pos] = "Vuln-Nil";
        });
        break;
      case "Vul East/West":
        classNames["East"] = "Vuln-Vul";
        classNames["West"] = "Vuln-Vul";
        classNames["North"] = "Vuln-Nil";
        classNames["South"] = "Vuln-Nil";
        break;
      case "Vul North/South":
        classNames["North"] = "Vuln-Vul";
        classNames["South"] = "Vuln-Vul";
        classNames["East"] = "Vuln-Nil";
        classNames["West"] = "Vuln-Nil";
        break;
      case "All Vul":
        positions.forEach((pos) => {
          classNames[pos] = "Vuln-Vul";
        });
        break;
    }
    let JSX;
    let header;
    if (editable) {
      header = (
        <div>
          <Col s={3} className={classNames["West"] + " Bidding-header_item"}>
            W
          </Col>
          <Col s={3} className={classNames["North"] + " Bidding-header_item"}>
            N
          </Col>
          <Col s={3} className={classNames["East"] + " Bidding-header_item"}>
            E
          </Col>
          <Col s={3} className={classNames["South"] + " Bidding-header_item"}>
            S
          </Col>
        </div>
      );
      JSX = this.state.data.map((entry, idx) => {
        // if (entry == '_' && idx <= 5) {
        //     return (<Col key={idx} s={3} className="Bidding-entry"></Col>);
        // }
        if (entry == "_") {
          return (
            <Col
              key={idx}
              s={3}
              className="Bidding-entry"
              onClick={() => this.resetToIdx(idx)}
            ></Col>
          );
        } else if (entry) {
          let artificialBid = false;

          // let artificialBidText = "";
          if (entry[0] === "*") {
            // console.log(entry);
            // console.log(entry.split("-"));
            artificialBid = true;
            entry = entry.slice(1);
            // [entry, artificialBidText] = entry.split('-');
            // console.log("Entry[0] was * so its artificial bid");
            // console.log("there should be artificial bid text:", artificialBidText);
          }
          // else {
          //     [entry] = entry.split('-');
          // }

          let number;
          let suit;
          switch (entry) {
            case "P":
            case "X":
              suit = entry[0];
              break;
            case "XX":
              suit = entry[0] + entry[1];
              break;
            default:
              number = entry[0];
              suit = entry[1];
          }
          if (entry[1] == "N") suit = "NT";
          // if (artificialBidText === "") {
          return (
            <Col
              key={idx}
              onClick={() => this.resetToIdx(idx)}
              s={3}
              className={`Bidding-entry ${this.getArtificialBidClass(
                artificialBid
              )}`}
            >
              <div className="Bidding-entry_number">{number}</div>
              <div className={this.getSuitStyles(suit)}>{suit}</div>
            </Col>
          );
          // }
          // else {
          //     console.log("THERE SHOULD BE SOME ARTIFICIAL BID TEXT: ", artificialBidText);
          //     return (
          //         <Col key={idx}
          //              onClick={() => this.resetToIdx(idx) }
          //              s={3}
          //              className={`Bidding-entry tooltipped ${this.getArtificialBidClass(artificialBid)}`}
          //              data-position="bottom" data-delay="50"
          //              data-tooltip={artificialBidText}
          //              title="this is a tooltip"
          //         >
          //             <div className="Bidding-entry-tooltip"></div>
          //
          //             <div className="Bidding-entry_number">
          //                 {number}
          //             </div>
          //             <div className={this.getSuitStyles(suit)}>
          //                 {suit}
          //             </div>
          //         </Col>
          //     );
          // }
        }
      });
    } else {
      header = (
        <div>
          <Col s={3} className={classNames["West"] + " Bidding-header_item"}>
            W
          </Col>
          <Col s={3} className={classNames["North"] + " Bidding-header_item"}>
            N
          </Col>
          <Col s={3} className={classNames["East"] + " Bidding-header_item"}>
            E
          </Col>
          <Col s={3} className={classNames["South"] + " Bidding-header_item"}>
            S
          </Col>
        </div>
      );
      JSX = this.state.data.map((entry, idx) => {
        if (entry == "_") {
          return (
            <Col
              key={idx}
              s={3}
              className="Bidding-entry Bidding-entry-blank"
            ></Col>
          );
        } else if (entry) {
          let artificialBid = false;
          // let artificialBidText = "";
          if (entry[0] === "*") {
            artificialBid = true;
            entry = entry.slice(1);
          }
          let number;
          let suit;
          switch (entry) {
            case "P":
            case "X":
              suit = entry[0];
              break;
            case "XX":
              suit = entry[0] + entry[1];
              break;
            default:
              number = entry[0];
              suit = entry[1];
          }
          if (entry[1] == "N") suit = "NT";
          return (
            <Col
              key={idx}
              s={3}
              className={`Bidding-entry ${this.getArtificialBidClass(
                artificialBid
              )}`}
            >
              <span className="Bidding-entry-number">{number}</span>
              <span
                className={`Bidding-entry-suit ${this.getSuitStyles(suit)}`}
              >
                {suit}
              </span>
            </Col>
          );
        }
      });
      // console.log("PRINTIN QUIZ TYPE")
      // console.log(this.props.quizType);

      // ##** TODO: Commented out because of deprecation of match.path (need fix)
      // if (
      //   this.props.match.path.includes("/quiz") &&
      //   this.props.quizType === "Bidding"
      // ) {
      //   JSX.push(
      //     <Col key="?" s={3} className="Bidding-entry Bidding-entry-next">
      //       ?
      //     </Col>
      //   );
      // }
    }

    const biddingGridClass = this.props.biddingGridClass
      ? this.props.biddingGridClass
      : "";
    const biddingClass = this.props.biddingClass ? this.props.biddingClass : "";
    return (
      <Row>
        <div className={`Bidding-container ${biddingClass}`}>
          {header}
          {JSX}
        </div>

        <div className={`${biddingGridClass}`}>
          {editable && (
            <BiddingGrid
              inputForm={true}
              bidding={this.state.data}
              currentMaxBid={this.state.currentMaxBid}
              makingBoard={this.props.makingBoard}
              clickHandler={(i, suit) => this.BiddingGridClicked(i, suit)}
            />
          )}

          {editable && (
            <Row>
              <Checkbox
                id="artificialBidCheckbox"
                // name="artificialBidChecked"
                //    type='checkbox'
                checked={this.state.artificialBidChecked || false}
                label="Next Bid is Artificial"
                onChange={(e) => this.artificialBidCheckboxChanged(e)}
              />
            </Row>
          )}
        </div>
      </Row>
    );
  }
}
export default withRouter(Bidding);
