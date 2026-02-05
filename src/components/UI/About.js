import React from 'react';
import {Row, Col, Card} from 'react-materialize';
import $ from 'jquery';
import './About.css';

class About extends React.Component {
    componentDidMount() {
        $('html, body').animate({scrollTop : 0},800);
    }

    render() {
        return (
            <div className="About-container">
                <Row>
                    <Col s={12} m={10} l={8} offset="m1 l2">
                        <Card className="About-card">
                            <h2 className="About-title">About Bridge Champions</h2>
                            
                            <div className="About-content">
                                <h4>Our Mission</h4>
                                <p>
                                    Bridge Champions makes high-quality bridge insights accessible in a way that is clear 
                                    and simple for the average player. We bring you the strategies and thinking from top-level 
                                    bridge, distilled into practical advice you can use at your next game.
                                </p>

                                <h4>About Paul Dalley</h4>
                                <p>
                                    Bridge Champions is run by Paul Dalley, an accomplished bridge player with dozens of 
                                    national championships in Australia and New Zealand. Paul has represented Australia on 
                                    the national team multiple times in recent years.
                                </p>

                                <h5>Recent Achievements</h5>
                                <ul className="About-achievements">
                                    <li><strong>2026</strong> — 1st place: National Open Teams (Canberra)</li>
                                    <li><strong>2026</strong> — 1st place: South West Pacific Teams (Canberra)</li>
                                    <li><strong>2025</strong> — 1st place: Gold Coast Pairs</li>
                                    <li><strong>2025</strong> — 1st place: Adelaide Open Teams</li>
                                    <li><strong>2025</strong> — 1st place: New Zealand Open Teams</li>
                                </ul>

                                <p>
                                    Paul regularly discusses bridge with top players both in Australia and internationally, 
                                    bringing their insights and expertise to Bridge Champions members.
                                </p>

                                <div className="About-cta">
                                    <p>
                                        Join Bridge Champions today to access expert analysis, instructional videos, 
                                        and personalized guidance to improve your game.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default About;
