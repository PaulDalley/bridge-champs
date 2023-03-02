import React, {Component} from 'react';
import {Row, Card} from 'react-materialize';
import './Hand.css';

class Hand extends Component {
    render() {
        const {position, spades, hearts, diamonds, clubs} = this.props;

        return (
            <div className="Hand-container" title="<span>test</span>">
                <Card className="Hand-card">
                    <div className="Hand-headerTwo Hand-row Hand-header">
                        <span className="Hand-posicon">&nbsp;{position[0]}&nbsp;
                         </span>
                        &nbsp;&nbsp;{position}
                    </div>
                    {/*<Row className="Hand-row Hand-header">*/}
                        {/*<span className="Hand-posicon">&nbsp;{position[0]}&nbsp;*/}
                        {/*</span>&nbsp;&nbsp;{position}*/}
                    {/*</Row>*/}
                    <Row className="Hand-row"><span className="Hand-suit">♠&nbsp;</span>{spades}</Row>
                    <Row className="Hand-row"><span className="Hand-suit red-suit">♥&nbsp;</span>{hearts}</Row>
                    <Row className="Hand-row"><span className="Hand-suit red-suit">♦&nbsp;</span>{diamonds}</Row>
                    <Row className="Hand-row"><span className="Hand-suit">♣&nbsp;</span>{clubs}</Row>
                </Card>
            </div>
        )
    }
}
export default Hand;
