import React, {Component} from 'react';
import Hand from './Hand';
import {Row, Col} from 'react-materialize';
import './MakeBoard.css';
import Vuln from './Vuln';
import Bidding from './Bidding';
import toastr from 'toastr';

class MakeBoard extends Component {
    state = {
        positions: [],
        spades: "",
        hearts: "",
        diamonds: "",
        clubs: "",
    };

    stripStart = arr => {
        let hand = {};
        console.log('stripStart input array:', arr);
        arr.forEach(el => {
            if (el && el.length >= 3) {
                const suit = el[0]; // S, H, D, or C
                const cards = el.slice(2); // Everything after "S-" or "H-" etc.
                hand[suit] = cards;
                console.log(`Parsed suit ${suit} = ${cards}`);
            }
        });
        console.log('stripStart result:', hand);
        return hand;
    };

    // return `<MakeBoard boardType="${boardType}" position="${position}" North="${North}" East="${East}" South="${South}" West="${West}" />`;

    componentDidMount() {
        // console.log("BIDDING");
        // console.log(this.props.bidding);
        // let [config, N, E, S, W] = this.props.board.split('_')
        console.log('=== MakeBoard componentDidMount ===');
        console.log('Props:', this.props);
        let {boardType, position, North, South, East, West} = this.props;
        console.log('Hand strings:', { North, South, East, West });
        let pos = {'North': North || '', 'East': East || '', 'South': South || '', 'West': West || ''};

        switch (boardType) {
            case 'single':
                const singleHand = pos[position] || '';
                console.log(`Single hand for ${position}:`, singleHand);
                const singleParsed = this.stripStart(singleHand.split('*').slice(1));
                console.log(`Parsed single hand:`, singleParsed);
                this.setState({
                    positions: [position],
                    boardType: 'single',
                    [position]: singleParsed
                });
                break;
            case 'double':
                const [left, right] = position.split('/');
                const leftHand = pos[left] || '';
                const rightHand = pos[right] || '';
                console.log(`Double hands - ${left}:`, leftHand, `${right}:`, rightHand);
                this.setState({
                    positions: [left, right],
                    boardType: 'double',
                    [left]: this.stripStart(leftHand.split('*').slice(1)),
                    [right]: this.stripStart(rightHand.split('*').slice(1))
                });
                break;
            case 'full':
                console.log('Full board hands:', { North, South, East, West });
                const northParsed = this.stripStart((North || '').split('*').slice(1));
                const southParsed = this.stripStart((South || '').split('*').slice(1));
                const eastParsed = this.stripStart((East || '').split('*').slice(1));
                const westParsed = this.stripStart((West || '').split('*').slice(1));
                console.log('Parsed full board:', { northParsed, southParsed, eastParsed, westParsed });
                this.setState({
                    positions: ['North', 'East', 'South', 'West'],
                    boardType: 'full',
                    North: northParsed,
                    East: eastParsed,
                    South: southParsed,
                    West: westParsed
                });
                break;
        }
    }

    handleHandInputChanged = (position, suit, cards) => {
        cards = cards.split("").unique().join("");
        this.props.handInputHandler(position, suit, cards);
        // let currentFilters = this.state[suit];
        // let flag = cards.split("").
        //     map(card => currentFilters.includes(card)).
        //     some(bool => bool);
        // console.log(flag);
        // if (flag) {
        //     toastr.error("2 hands cannot have the same card!");
        //
        // }
        // else {
        //     this.setState({ suit: currentFilters + })
        //     this.props.handInputHandler(position, suit, cards);
        // }
    }


    makeFullBoard = () => {
        positions: ['North', 'East', 'South', 'West'];
        // console.log("INSIDE MAKEFULLBOARD");
        // console.log(this.props);
        let {boardType, position, North, South, East, West, handClickhandler, handInputHandler, inputBoard } = this.props;
        const North_ = this.stripStart(North.split('*').slice(1));
        const East_ = this.stripStart(East.split('*').slice(1));
        const South_ = this.stripStart(South.split('*').slice(1));
        const West_ = this.stripStart(West.split('*').slice(1));
        // const styles = ['MakeBoard-full_North', 'MakeBoard-full_East', 'MakeBoard-full_South', 'MakeBoard-full_West'];

        if (handClickhandler !== undefined) {
            let showInputs = {
                'North': false,
                'South': false,
                'West': false,
                'East': false,
            }
            // console.log(position);
            if (position && position.includes('/')) {
                let [left, right] = position.split('/');
                showInputs[left] = true;
                showInputs[right] = true;
            } else if (position === 'full') {
                showInputs['North'] = true;
                showInputs['East'] = true;
                showInputs['South'] = true;
                showInputs['West'] = true;
            } else {
                showInputs[position] = true;
            }
            // console.log(showInputs);

            return (
                <div className="MakeBoard-container-fullBoard">
                    <div>
                        <Vuln vuln={this.props.vuln} dealer={this.props.dealer} bidding={this.props.bidding}/>
                    </div>
                    <div onClick={() => handClickhandler("North")}
                        className="MakeBoard-fullBoard-North GenerateBridgeBoardClient-hand">
                        <Hand position="North"
                              spades={North_.S}
                              hearts={North_.H}
                              diamonds={North_.D}
                              clubs={North_.C}
                              handInputHandler={this.handleHandInputChanged}
                              showInputs={showInputs['North']}
                        />
                    </div>
                    <div className="MakeBoard-fullBoard-bidding">
                        {!this.props.hideBidding &&
                        <Bidding vuln={this.props.vuln}
                                 dealer={this.props.dealer}
                                 editable={false}
                                 bidding={this.props.bidding}
                                 getBidding={this.props.getBidding}
                                 isQuiz={this.props.isQuiz}
                                 quizType={this.props.quizType}
                        />}
                    </div>
                    <div onClick={() => handClickhandler("West")}
                        className="MakeBoard-fullBoard-West GenerateBridgeBoardClient-hand">
                        <Hand position="West"
                              spades={West_.S}
                              hearts={West_.H}
                              diamonds={West_.D}
                              clubs={West_.C}
                              handInputHandler={this.handleHandInputChanged}
                              showInputs={showInputs['West']}
                        />
                    </div>
                    <div></div>
                    <div onClick={() => handClickhandler("East")}
                        className="MakeBoard-fullBoard-East GenerateBridgeBoardClient-hand">
                        <Hand position="East"
                              spades={East_.S}
                              hearts={East_.H}
                              diamonds={East_.D}
                              clubs={East_.C}
                              handInputHandler={this.handleHandInputChanged}
                              showInputs={showInputs['East']}
                        />
                    </div>
                    <div></div>
                    <div onClick={() => handClickhandler("South")}
                        className="MakeBoard-fullBoard-South GenerateBridgeBoardClient-hand">
                        <Hand position="South"
                              spades={South_.S}
                              hearts={South_.H}
                              diamonds={South_.D}
                              clubs={South_.C}
                              handInputHandler={this.handleHandInputChanged}
                              showInputs={showInputs['South']}
                        />
                    </div>
                    <div></div>
                </div>
            );
        }
        else {
            return (
                <div className="MakeBoard-container-fullBoard">
                    <div>
                        <Vuln vuln={this.props.vuln} dealer={this.props.dealer} bidding={this.props.bidding}/>
                    </div>
                    <div className="MakeBoard-fullBoard-North">
                        <Hand position="North"
                              spades={North_.S}
                              hearts={North_.H}
                              diamonds={North_.D}
                              clubs={North_.C}/>
                    </div>
                    <div className="MakeBoard-fullBoard-bidding">
                        {!this.props.hideBidding &&
                        <Bidding vuln={this.props.vuln}
                                 dealer={this.props.dealer}
                                 editable={false}
                                 bidding={this.props.bidding}
                                 getBidding={this.props.getBidding}
                                 isQuiz={this.props.isQuiz}
                                 quizType={this.props.quizType}
                        />}
                    </div>
                    <div className="MakeBoard-fullBoard-West">
                        <Hand position="West"
                              spades={West_.S}
                              hearts={West_.H}
                              diamonds={West_.D}
                              clubs={West_.C}/>
                    </div>
                    <div></div>
                    <div className="MakeBoard-fullBoard-East">
                        <Hand position="East"
                              spades={East_.S}
                              hearts={East_.H}
                              diamonds={East_.D}
                              clubs={East_.C}/>
                    </div>
                    <div></div>
                    <div className="MakeBoard-fullBoard-South">
                        <Hand position="South"
                              spades={South_.S}
                              hearts={South_.H}
                              diamonds={South_.D}
                              clubs={South_.C}/>
                    </div>
                    <div></div>
                </div>
            );
        }

    }

    makeBoard = () => {
        // const suitsMapper = {'spades': '♠', 'clubs': '♣', 'hearts': '♥', 'diamonds': '♦'};
        // const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        // let {hand} = this.state;
        //
        let boardType;
        let {positions} = this.state;
        let styles = ['', '', '', ''];
        let mapper = {'North': 0, 'East': 1, 'South': 2, 'West': 3};
        // console.log("POSITIONS LENGTH: ", positions.length);
        switch (positions.length) {
            // case 4:
            //     styles = ['MakeBoard-full_North', 'MakeBoard-full_East', 'MakeBoard-full_South', 'MakeBoard-full_West'];
            //     break;
            case 2:
                let teaserStyleClass = "";
                if (this.props.isTeaser) {
                    teaserStyleClass = "MakeBoard-double_teaser"
                }
                styles[mapper[positions[0]]] = `MakeBoard-double_${positions[0]} ${teaserStyleClass}`;
                styles[mapper[positions[1]]] = `MakeBoard-double_${positions[1]} ${teaserStyleClass}`;
                boardType = "double";
                break;
            case 1:
                styles[mapper[positions[0]]] = 'MakeBoard-single';
                boardType = "single";
                break;
        }
        let board = positions.map((position, idx) => {
            // console.log(position, idx, styles[idx]);
            // let symbol = suitsMapper[position];
            return (
                <Row className={styles[mapper[position]]} key={position}>
                    <Col className={boardType === "double" ? "MakeBoard-double_col" : ""}>
                        <Hand position={position}
                              spades={this.state[position].S}
                              hearts={this.state[position].H}
                              diamonds={this.state[position].D}
                              clubs={this.state[position].C}/>
                    </Col>
                </Row>)
        });
        let teaserStyleClassX = "";
        if (this.props.isTeaser) {
            teaserStyleClassX = "MakeBoard-bidding_container_double_teaser";
            // console.log(" IN HERE ")
        }

        // console.log("IN HERE");
        // console.log(this.props.bidding);
        return (
            <div className={`MakeBoard-container_${boardType} ${teaserStyleClassX}`}>
                    {board}
                    { this.props.bidding !== "" && (this.props.bidding.length > 0) &&
                    <div className={`MakeBoard-bidding_container MakeBoard-bidding_container_double`}>
                        <Bidding vuln={this.props.vuln}
                                 dealer={this.props.dealer}
                                 editable={false}
                                 bidding={this.props.bidding}
                                 getBidding={this.props.getBidding}
                                 isQuiz={this.props.isQuiz}
                                 quizType={this.props.quizType}
                        />
                    </div>}
            </div>);
    }

    render() {
        let containerStyles = "MakeBoard-container";
        // if (this.props.boardType === 'full') {
        //     containerStyles += " MakeBoard-container-fullBoard";
        // }

        return (
            <div className={`MakeBoard-outer_container ${containerStyles}`}>
                {this.props.showVuln === undefined && this.props.boardType !== 'full' &&
                    <Vuln vuln={this.props.vuln} dealer={this.props.dealer} bidding={this.props.bidding}/>
                }
                {this.props.boardType !== 'full' &&
                    <div className="MakeBoard-bridge_board">{this.makeBoard()}</div>
                }
                { this.props.boardType === 'full' && this.props.positions !== [] &&
                    <div className="MakeBoard-bridge_board">{this.makeFullBoard()}</div>
                }


            </div>
        )
    }
}
export default MakeBoard;
