import React, {Component} from 'react';
import {Row, Col} from 'react-materialize';
import { SUITS, isGreaterBid, canDoubleChecker } from '../../helpers/helpers';
import './BiddingGrid.css';
import $ from 'jquery';

class BiddingGrid extends Component {
    state = {
        SUITS: {
            CLUBS: 'clubs',
            DIAMONDS: 'diamonds',
            HEARTS: 'hearts',
            SPADES: 'spades',
            NT: 'nt'
        },
        lastClicked: "",
        currentMaxBid: undefined,
        passCounter: 0,
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.currentMaxBid === undefined) {
            this.setState({currentMaxBid: nextProps.currentMaxBid});
        }
        else if (nextProps.currentMaxBid === "_") {
            this.setState({ currentMaxBid: "0♣" });
        }
        else if (nextProps.currentMaxBid !== this.state.currentMaxBid) {
            this.setState({currentMaxBid: nextProps.currentMaxBid });
        }
    }

    handleClick = (i, suit, suitString, lockBid) => {
        if (lockBid) {
            return;
        }
        let lastClicked = '.' + this.state.lastClicked;
        if(this.state.lastClicked !== "") {
            $(lastClicked).removeClass('BiddingGrid-item_clicked')
        }

        if(suit) {
            let num = i;
            if (num === "?") num = "Q";
            let justClicked = '.' + num + '-' + suitString;
            $(justClicked).addClass('BiddingGrid-item_clicked');
            if (this.props.inputForm) {
                this.setState({lastClicked: num+'-'+suitString, currentMaxBid: i+suit });
            }
            else {
                this.setState({lastClicked: num+'-'+suitString });
            }
        }
        else {
            // SEAM TO COUNT 3 passes here.
            // if (i==="P") this.setState((prevState) => ({ passCounter: prevState.passCounter + 1}), () => console.log(this.state.passCounter));
            // else this.setState({ passCounter: 0 }, () => console.log(this.state.passCounter));

            let num = i;
            if (num === "?") num = "Q";
            let justClicked = ".BiddingGrid-" + num;
            $(justClicked).addClass('BiddingGrid-item_clicked');
            this.setState({lastClicked: "BiddingGrid-"+num});
        }
        this.props.clickHandler(i, suit);
    }

    makeGrid = () => {
        let currentMaxBid = this.state.currentMaxBid;
        // console.log(currentMaxBid);
        const lockedStyles = { opacity: '.40', backgroundColor: "#F5F5F5"};
        let lockBid = {
            '♣': false,
            '♦': false,
            '♥': false,
            '♠': false,
            'NT': false,
        };
        let grid = [];
        for (let i = 1; i <= 7; i++) {

            if (currentMaxBid) {
                for (let j = 0; j < SUITS.length; j++) {
                    if (isGreaterBid(currentMaxBid, `${i}${SUITS[j]}`)) {
                        lockBid[SUITS[j]] = true;
                    } else {
                        lockBid[SUITS[j]] = false;
                    }
                }
            }
            let lockClubs = lockBid['♣'];
            let lockDiamonds = lockBid['♦'];
            let lockHearts = lockBid['♥'];
            let lockSpades = lockBid['♠'];
            let lockNT = lockBid['NT'];

            grid.push(
                    <Row key={i} className="BiddingGrid-row">
                        <Col key={`${i}-CLUBS`}
                             onClick={() => this.handleClick(i, '♣', 'CLUBS', lockClubs)}
                             s={2}
                             style={lockClubs ? lockedStyles : {}}
                             className={`BiddingGrid-col ${i}-CLUBS`}>
                            {i}<span className="BiddingGrid-black-suit">♣</span>
                        </Col>
                        <Col key={`${i}-DIAMONDS`}
                             onClick={() => this.handleClick(i, '♦', 'DIAMONDS', lockDiamonds)}
                             s={2}
                             style={lockDiamonds ? lockedStyles : {}}
                             className={`BiddingGrid-col ${i}-DIAMONDS`}>
                            {i}<span className="BiddingGrid-red-suit">♦</span>
                        </Col>
                        <Col key={`${i}-HEARTS`}
                             onClick={() => this.handleClick(i, '♥', 'HEARTS', lockHearts)}
                             s={2}
                             style={lockHearts ? lockedStyles : {}}
                             className={`BiddingGrid-col ${i}-HEARTS`}>
                            {i}<span className="BiddingGrid-red-suit">♥</span>
                        </Col>
                        <Col key={`${i}-SPADES`}
                             onClick={() => this.handleClick(i, '♠', 'SPADES', lockSpades)}
                             s={2}
                             style={lockSpades ? lockedStyles : {}}
                             className={`BiddingGrid-col ${i}-SPADES`}>
                            {i}<span className="BiddingGrid-black-suit">♠</span>
                        </Col>
                        <Col key={`${i}-NT`}
                             onClick={() => this.handleClick(i, 'NT', 'NT', lockNT)}
                             s={2}
                             style={lockNT ? lockedStyles : {}}
                             className={`BiddingGrid-col ${i}-NT`}>
                            {i}<span className="BiddingGrid-black-suit">NT</span>
                        </Col>
                    </Row>
            );
        }

        const [ canDouble, canRedouble ] = canDoubleChecker(this.props.bidding);

        grid.push(
            <Row key="x">
                <Col key='XX'
                     onClick={() => this.handleClick('XX', undefined, undefined, !canRedouble)} s={2}
                     className='BiddingGrid-col BiddingGrid-XX BiddingGrid-BottomButtons'
                     style={canRedouble ? {} : lockedStyles}
                >
                    <span className="black-suit">XX</span>
                </Col>
                <Col key='PASS' onClick={() => this.handleClick('P')} s={6} className='BiddingGrid-col BiddingGrid-P BiddingGrid-BottomButtons'>
                    <span className="black-suit">Pass</span>
                </Col>
                <Col key='X'
                     onClick={() => this.handleClick('X', undefined, undefined, !canDouble)} s={2}
                     className='BiddingGrid-col BiddingGrid-X  BiddingGrid-BottomButtons'
                     style={canDouble ? {} : lockedStyles }
                >
                    <span className="black-suit">X</span>
                </Col>
                {this.props.makingBoard &&
                <Col key='?' onClick={() => this.handleClick('?')} s={2} className='BiddingGrid-col BiddingGrid-Q'>
                    <span className="black-suit">?</span>
                </Col>
                }
                {this.props.makingBoard &&
                <Col key='Y' onClick={() => this.handleClick('_')} s={2} className='BiddingGrid-col'>
                    <span className="black-suit">_</span>
                </Col>
                }
            </Row>
        );
        return grid;
    }

    render() {
        return (
            <div className="BiddingGrid-container">
                {this.makeGrid()}
            </div>
        );
    }
}
export default BiddingGrid;
