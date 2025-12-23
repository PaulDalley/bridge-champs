import React, {Component} from 'react';
import {Button, Row, Col, Icon, Input} from 'react-materialize';
import Hand from './Hand';
import './BridgeHandmaker.css';

class BridgeHandmaker extends Component {
    state = {
        spades: this.props.spades,
        hearts: this.props.hearts,
        diamonds: this.props.diamonds,
        clubs: this.props.clubs
        // spades: "",
        // hearts: "",
        // diamonds: "",
        // clubs: "",
        // position: this.props.position
    }
    // shouldComponentUpdate() {
    //     return this.state.position === this.props.position;
    // }
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.position !== this.props.position) {
    //         console.log(this.props.position);
    //         console.log(prevState.position);
    //         this.setState({spades: "", hearts: "", diamonds: "", clubs: ""}, () => {
    //             console.log(this.state);
    //         });
    //     }
    // }
    // componentWillReceiveProps() {
    //     // this.setState({spades: "", hearts: "", diamonds: "", clubs: ""});
    // }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
        // this.setState({[e.target.name]: e.target.value}, () => {
        //     this.props.passBoardUp({...this.state, position: this.props.position});
        // });
    }

    render() {
        const {position} = this.props
        const {spades, hearts, diamonds, clubs} = this.state;

        return (
            <div className="BridgeHandmaker-container">
                {/*<Hand position={position}*/}
                {/*spades="Q"*/}
                {/*hearts="AJ98763" diamonds="Q94" clubs="108"/>*/}
                <Row>
                    <Col>
                        <Hand position={position}
                              spades={spades}
                              hearts={hearts}
                              diamonds={diamonds}
                              clubs={clubs}/>
                    </Col>
                    <Col>
                        <div className="BridgeHandmaker-form">
                            <Row className="Hand-row">
                                <Input
                                    name="spades"
                                    value={this.state.spades}
                                    onChange={this.handleChange}
                                    label="♠"/>
                            </Row>
                            <Row className="Hand-row">
                                <Input
                                    name="hearts"
                                    value={this.state.hearts}
                                    onChange={this.handleChange}
                                    label="♥"/>
                            </Row>
                            <Row className="Hand-row">
                                <Input
                                    name="diamonds"
                                    value={this.state.diamonds}
                                    onChange={this.handleChange}
                                    label="♦"/>
                            </Row>
                            <Row className="Hand-row">
                                <Input
                                    name="clubs"
                                    value={this.state.clubs}
                                    onChange={this.handleChange}
                                    label="♣"/>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default BridgeHandmaker;

// <Row className="Hand-row"><span className="Hand-suit">♠&nbsp;</span>{spades}</Row>
// <Row className="Hand-row"><span className="Hand-suit red-suit">♥&nbsp;</span>{hearts}</Row>
// <Row className="Hand-row"><span className="Hand-suit red-suit">♦&nbsp;</span>{diamonds}</Row>
// <Row className="Hand-row"><span className="Hand-suit">♣&nbsp;</span>{clubs}</Row>