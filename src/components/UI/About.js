import React from 'react';
import {Row, Col,} from 'react-materialize';
import $ from 'jquery';

class About extends React.Component {
    componentDidMount() {
        $('html, body').animate({scrollTop : 0},800);
    }


    render() {
        return (
            <div className="HomePage-content">
                <Row>
                    <Col s={12}>
                        <p>
                            The best in the world break down exactly what they are thinking about in the bidding and the
                            play. Our experts provide educational articles and fresh analysis from hands that they have
                            recently played.
                        </p>
                        <br/>

                        <br/>
                        {/*<h2 className="HomePage-profile_title">*/}
                        {/*<h1 style={{textShadow: "#8d0018 1px 0 10px", fontSize: '5rem', letterSpacing: '.2rem', textAlign: 'center', textDecoration: "none", paddingBottom: '1rem'}}>*/}
                        <h1 style={{
                            borderTop: "2rem dotted lightgray",
                            fontSize: '8rem',
                            letterSpacing: '.05rem',
                            textAlign: 'center',
                            textDecoration: "none",
                            padding: '1rem',
                            paddingTop: '8rem',
                            fontFamily: "Dancing Script, cursive"
                        }}>
                            Some of our players
                        </h1>
                    </Col>
                </Row>
                <div className="HomePage-profile_card_container2">
                    {/*<Col className="HomePage-profile_card" m={6} s={12}>*/}
                    <div className="HomePage-profile_card2">

                        {/*<Card className='large'*/}
                        {/*header={<CardTitle image='http://usbf.org/images/players/DelMonte.jpg'>Card Title</CardTitle>}*/}
                        {/*actions={[<a href='#'>This is a Link</a>]}>*/}
                        {/*<ul>*/}
                        {/*<li>Short bio / highlights (including winning a world championship pairs event)</li>*/}
                        {/*<li>Most recent achievements</li>*/}
                        {/*<li>Top 4 in the (forgot the name, event that NZ team has been in)</li>*/}
                        {/*<li>In the NZ national team for X years</li>*/}
                        {/*<li>Excellent recent results in national events in Australia including winning Canberra Festival of Bridge in January</li>*/}
                        {/*</ul>*/}
                        {/*</Card>*/}
                        {/*<Card className="HomePage-profile_img"*/}
                        {/*heder={<CardTitle reveal*/}
                        {/*image={"http://usbf.org/images/players/DelMonte.jpg"}*/}
                        {/*waves='light'*/}
                        {/*// className="HomePage-profile_img"*/}
                        {/*/>}*/}
                        {/*title="Ishmael Del'Monte"*/}
                        {/*reveal={      <ul>*/}
                        {/*<li>Short bio / highlights (including winning a world championship pairs event)</li>*/}
                        {/*<li>Most recent achievements</li>*/}
                        {/*<li>Top 4 in the (forgot the name, event that NZ team has been in)</li>*/}
                        {/*<li>In the NZ national team for X years</li>*/}
                        {/*<li>Excellent recent results in national events in Australia including winning Canberra Festival of Bridge in January</li>*/}
                        {/*</ul>}>*/}
                        {/*<p><a href="http://db.worldbridge.org/Repository/peopleforscrap/person.asp?qryid=6047">World Bridge Federation Profile</a></p>*/}
                        {/*</Card>*/}

                        <div className="card">
                            <div className="card-image waves-effect waves-block waves-light">
                                <img className="HomePage-profile_img activator"
                                     src="http://usbf.org/images/players/DelMonte.jpg"
                                />
                            </div>
                            <div className="card-content">
                            <span className="card-title activator grey-text text-darken-4">Ishmael Del'Monte<i
                                className="material-icons right">more_vert</i></span>
                                <p><a
                                    target="_blank"
                                    href="http://db.worldbridge.org/Repository/peopleforscrap/person.asp?qryid=6047">
                                    World Bridge Federation Profile
                                </a>
                                </p>
                            </div>
                            <div className="card-reveal">
                            <span className="card-title grey-text text-darken-4">Ishmael Del'Monte<i
                                className="material-icons right">close</i></span>
                                <p>
                                    See World Bridge Federation Profile for a detailed history of this player.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/*<Col className="HomePage-profile_card" m={6} s={12}>*/}
                    <div className="HomePage-profile_card2">
                        {/*<Card className='small'*/}
                        {/*header={<CardTitle image='http://db.worldbridge.org/Repository/PhotoGallery/Photos/6048.jpg'>Card Title</CardTitle>}*/}
                        {/*actions={[<a href='#'>This is a Link</a>]}>*/}
                        {/*I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.*/}
                        {/*</Card>*/}
                        {/*<Card className="HomePage-profile_img"*/}
                        {/*header={<CardTitle reveal*/}
                        {/*image={"http://db.worldbridge.org/Repository/PhotoGallery/Photos/6048.jpg"}*/}
                        {/*waves='light'*/}
                        {/*// className="HomePage-profile_img"*/}
                        {/*/>}*/}
                        {/*title="Ashley Bach"*/}
                        {/*reveal={<p>Here is some more information about this product that is only revealed once clicked on.</p>}>*/}
                        {/*<p><a href="http://db.worldbridge.org/Repository/peopleforscrap/person.asp?qryid=6048">World Bridge Federation Profile</a></p>*/}
                        {/*</Card>*/}
                        <div className="card">
                            <div className="card-image waves-effect waves-block waves-light">
                                <img className="HomePage-profile_img activator"
                                     src="http://db.worldbridge.org/Repository/PhotoGallery/Photos/6048.jpg"
                                />
                            </div>
                            <div className="card-content">
                            <span className="card-title activator grey-text text-darken-4">Ashley Bach<i
                                className="material-icons right">more_vert</i></span>
                                <p><a target="_blank"
                                      href="http://db.worldbridge.org/Repository/peopleforscrap/person.asp?qryid=6048">
                                    World Bridge Federation Profile
                                </a>
                                </p>
                            </div>
                            <div className="card-reveal">
                            <span className="card-title grey-text text-darken-4">Ashley Bach<i
                                className="material-icons right">close</i></span>
                                <p>
                                    See World Bridge Federation Profile for a detailed history of this player.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/*</Col>*/}
                </div>
                <div className="HomePage-details-card">
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker">♠</div>
                            <span className="PremiumMembership-text-row">
                                    Our analysis is sourced from carefully selected World Class experts competing at the highest level.
                                </span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker red-suit">♥</div>
                            <span className="PremiumMembership-text-row">
                                Follow Ish and Ashley through major World Championship events as they share their ideas on winning Bridge.
                                </span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker red-suit">♦</div>
                            <span className="PremiumMembership-text-row">

                                    <strong>Practical and easy</strong> insights that you can use tomorrow at the Bridge table.
                                </span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker">♣</div>
                            <span className="PremiumMembership-text-row">

                                    Content sorted by difficulty, perfect for both the beginner and expert.</span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker">♠</div>
                            <span className="PremiumMembership-text-row">
                                        Fun daily quizzes to test your knowledge.</span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker red-suit">♥</div>
                            <span className="PremiumMembership-text-row">
                                        Lots of fresh content added every week.</span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker red-suit">♦</div>
                            <span className="PremiumMembership-text-row">
                                        Regular videos of play and analysis (coming soon).</span></div>
                    </div>
                    <div className="PremiumMembership-row HomePage-row">
                        <div className="PremiumMembership-text-row">
                            <div className="HomePage-card_symbol_marker">♣</div>
                            <span className="PremiumMembership-text-row">
                                        Upcoming features, including live chat, submit a question, and <strong>“Bid with Ish”.</strong>
                                </span></div>
                    </div>
                    <div className="HomePage-logo-container">
                        {/*<div className="PremiumMembership-header_overlay_textcaption">*/}
                        {/*For expert knowledge*/}
                        {/*</div>*/}
                        <div className="HomePage-header_overlay"></div>
                        {/*<div className="PremiumMembership-header_overlay_shadow"></div>*/}
                        <div className="HomePage-logosmall-B">
                            B
                        </div>
                        <div className="HomePage-logosmall-C">
                            C
                        </div>
                    </div>
                </div>

            </div>
        )
    }
};

export default About;