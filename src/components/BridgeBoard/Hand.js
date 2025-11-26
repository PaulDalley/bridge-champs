import React, {Component} from 'react';
import {Row, Card} from 'react-materialize';
import './Hand.css';

class Hand extends Component {
    // state = {
    //     spades: "",
    //     hearts: "",
    //     diamonds: "",
    //     clubs: "",
    // }
    //
    render() {
        const {position, spades, hearts, diamonds, clubs, handInputHandler, showInputs} = this.props;

        if (handInputHandler === undefined || !showInputs) {
            return (
                <div className="Hand-container">
                    <Card className="Hand-card">
                        <div className="Hand-headerTwo Hand-row Hand-header">
                        <span className="Hand-posicon">&nbsp;{position[0]}&nbsp;
                         </span>
                            &nbsp;&nbsp;{position}&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        {/*<Row className="Hand-row Hand-header">*/}
                        {/*<span className="Hand-posicon">&nbsp;{position[0]}&nbsp;*/}
                        {/*</span>&nbsp;&nbsp;{position}*/}
                        {/*</Row>*/}
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit black-suit">♠&nbsp;</span>
                            <span className="Hand-row_cardstext Hand-text">{spades}</span>
                        </Row>
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit red-suit">♥&nbsp;</span>
                            <span className="Hand-row_cardstext Hand-text">{hearts}</span>
                        </Row>
                        <Row className="Hand-row Hand-row_diamond">
                            <span className="Hand-row_cardstext Hand-suit red-suit diamond-suit">♦&nbsp;</span>
                            <span className="Hand-row_cardstext Hand-text">{diamonds}</span>
                        </Row>
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit black-suit">♣&nbsp;</span>
                            <span className="Hand-row_cardstext Hand-text">{clubs}</span>
                        </Row>
                    </Card>
                </div>
            );
        }
        else {
            return (
                <div className="Hand-container">
                    <Card className="Hand-card">
                        <div className="Hand-headerTwo Hand-row Hand-header">
                        <span className="Hand-posicon">&nbsp;{position[0]}&nbsp;
                         </span>
                            &nbsp;&nbsp;{position}&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        {/*<Row className="Hand-row Hand-header">*/}
                        {/*<span className="Hand-posicon">&nbsp;{position[0]}&nbsp;*/}
                        {/*</span>&nbsp;&nbsp;{position}*/}
                        {/*</Row>*/}
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit black-suit">♠&nbsp;</span>
                            <input
                                className="GenerateBridgeBoardClient-single_input"
                                name='spades'
                                    value={spades}
                                onChange={(e) => {
                                    handInputHandler(position, e.target.name, e.target.value);
                                }}
                                />

                            {/*<span className="Hand-row_cardstext Hand-text">{spades}</span>*/}
                        </Row>
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit red-suit">♥&nbsp;</span>
                            <input
                                className="GenerateBridgeBoardClient-single_input"
                                name='hearts'
                                    value={hearts}
                                onChange={(e) =>
                                    handInputHandler(position, e.target.name, e.target.value)}
                            />
                            {/*<span className="Hand-row_cardstext Hand-text">{hearts}</span>*/}
                        </Row>
                        <Row className="Hand-row Hand-row_diamond">
                            <span className="Hand-row_cardstext Hand-suit red-suit diamond-suit">♦&nbsp;</span>
                            <input
                                className="GenerateBridgeBoardClient-single_input"
                                name='diamonds'
                                value={diamonds}
                                onChange={(e) =>
                                    handInputHandler(position, e.target.name, e.target.value)}
                            />
                            {/*<span className="Hand-row_cardstext Hand-text">{diamonds}</span>*/}
                        </Row>
                        <Row className="Hand-row">
                            <span className="Hand-row_cardstext Hand-suit black-suit">♣&nbsp;</span>
                            {/*<span className="Hand-row_cardstext Hand-text">{clubs}</span>*/}
                            <input
                                className="GenerateBridgeBoardClient-single_input"
                                name='clubs'
                                value={clubs}
                                onChange={(e) =>
                                    handInputHandler(position, e.target.name, e.target.value)}
                            />
                        </Row>
                    </Card>
                </div>
            )
        }
    }
}
export default Hand;
