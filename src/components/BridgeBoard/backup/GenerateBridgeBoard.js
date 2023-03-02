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
import BridgeBoardMaker from "./BridgeBoardMaker";

import "./GenerateBridgeBoard.css";

class GenerateBridgeBoard extends Component {
  state = {
    boardType: "single",
    singleHand: "North",
    doubleHand: "North/South",
    single: {},
    double: {},
    full: {},
  };

  // componentDidMount() {
  //     console.log("mounting");
  //     console.log(this.state.boardType);
  // }

  handleChange = (e) => {
    // console.log("UPDATING:");
    // console.log(e.target.name);
    // console.log(e.target.value);
    const name = e.target.name;

    this.setState({ [e.target.name]: e.target.value });
  };

  getBoardFromChild = (board) => {
    const { boardType, ...newBoard } = board;
    this.setState({ [boardType]: newBoard });
    // const currHands = {...this.state.boardType};
    // currHands[position] = {...newBoard};
    // this.setState({hands: currHands});
  };

  generateHand = (hand) => {
    // console.log(hand)
  };

  //     e.preventDefault();
  //     switch (this.state.boardType) {
  //         case 'single':
  //             console.log(this.state.singleHand);
  //             console.log(this.state[this.state.boardType][this.state.singleHand]);
  //             break;
  //         case 'double':
  //             console.log(this.state.doubleHand);
  //             console.log(this.state.double);
  //             break;
  //         case 'full':
  //             console.log(this.state.full);
  //             break;
  //     }
  // }

  changeBoardType = (boardType) => {
    this.setState({ boardType });
  };

  render() {
    return (
      <div>
        <Collapsible popout>
          <CollapsibleItem header="Create Hand" icon="add_circle">
            <Collapsible accordion>
              <CollapsibleItem
                onSelect={() => this.changeBoardType("single")}
                header="Single Hand"
                icon="filter_1"
              >
                <Row>
                  <Select
                    s={12}
                    name="singleHand"
                    //    type="select"
                    label="Position"
                    value={this.state.singleHand}
                    onChange={this.handleChange}
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </Select>
                </Row>
                <div className="GenerateBridgeBoard-single_container">
                  {this.state.boardType == "single" && (
                    <BridgeBoardMaker
                      position={this.state.singleHand}
                      boardType="single"
                      genHand={this.generateHand}
                    />
                  )}
                </div>
              </CollapsibleItem>

              <CollapsibleItem
                onSelect={() => this.changeBoardType("double")}
                header="Second"
                icon="filter_2"
              >
                <Row>
                  <Input
                    s={12}
                    name="doubleHand"
                    type="select"
                    label="Positions"
                    value={this.state.doubleHand}
                    onChange={this.handleChange}
                  >
                    <option value="North/South">North/South</option>
                    <option value="North/East">North/East</option>
                    <option value="North/West">North/West</option>
                  </Input>
                </Row>
                <div className="GenerateBridgeBoard-single_container">
                  {this.state.boardType == "double" && (
                    <BridgeBoardMaker
                      position={this.state.doubleHand}
                      boardType="double"
                      genHand={this.generateHand}
                    />
                  )}
                </div>
              </CollapsibleItem>

              <CollapsibleItem
                onSelect={() => this.changeBoardType("full")}
                header="Full Hand/Double Dummy"
                icon="filter_4"
              >
                <div className="GenerateBridgeBoard-single_container">
                  {this.state.boardType == "full" && (
                    <BridgeBoardMaker
                      position="full"
                      boardType="full"
                      genHand={this.generateHand}
                    />
                  )}
                </div>
              </CollapsibleItem>
            </Collapsible>
            {/*checked={true}*/}
            {/*<Row onChange={this.handleChange}>*/}
            {/*<Input name='boardType' type='radio' value='single'*/}
            {/*label='Single' checked={true}/>*/}
            {/*<Input name='boardType' type='radio' value='double'*/}
            {/*label='Double'/>*/}
            {/*<Input name='boardType' type='radio' value='full' label='Full'*/}
            {/*className='with-gap'/>*/}
            {/*</Row>*/}
          </CollapsibleItem>
        </Collapsible>
      </div>
    );
  }
}
export default GenerateBridgeBoard;
