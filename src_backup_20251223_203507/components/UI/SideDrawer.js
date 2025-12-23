import React from 'react';
import './SideDrawer.css';
// import Logo from './LogoSmallInv';
import Backdrop from './Backdrop';
import DisplayUserInfo from './DisplayUserInfo';
import {NavLink, Link} from 'react-router-dom';
const logo = require('../../assets/images/logo-small-inv-t.png');


const SideDrawer = ({
                        sideDrawerOpen,
                        toggleSideDrawer,
                        name,
                        email,
                        photo,
                        subscriptionExpires,
                        totalQuizScore,
                        uid,
                        subscriptionActive,
                    }) => {
    // console.log("subscription expires", subscriptionExpires);
    // console.log(totalQuizScore);

    let statusClass;
    if (sideDrawerOpen) {
        statusClass = "SideDrawer-Open";
    }
    else {
        statusClass = "SideDrawer-Closed";
    }
    const xStatus = statusClass.split("-")[1];
    // console.log(xStatus);
    return (
        <div className="SideDrawer-outer_container">
            <Backdrop show={sideDrawerOpen} backdropClicked={toggleSideDrawer}/>

            <div className={`SideDrawer-container ${statusClass}`}
                 // onClick={() => toggleSideDrawer()}
            >


                <div style={{marginTop: '5rem', minHeight: '18rem', maxHeight: '18rem'}}>
                <DisplayUserInfo name={name} email={email} photo={photo}
                                 subscriptionExpires={subscriptionExpires}
                                 totalQuizScore={totalQuizScore}
                                 uid={uid}
                                 subscriptionActive={subscriptionActive}
                />
                </div>

                <div className="SideDrawer-Links">
                    <ul className="SideDrawer-NavLinks">
                        <li className="SideDrawer-NavLink SideDrawer-Divider">
                            <div className="divider"></div>
                        </li>
                        {/*<br/>*/}
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink"
                                     exact to="/"
                                     onClick={() => toggleSideDrawer()}>
                                <i className="SideDrawer-link_icon fas fa-home"></i>
                                Home
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink activeClassName="SideDrawer-NavLink-Active" className="SideDrawer-NavLink"
                                     to="/articles"
                                     onClick={() => toggleSideDrawer()}
                            >
                                <i className="SideDrawer-link_icon far fa-newspaper"></i>
                                Articles
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink activeClassName="SideDrawer-NavLink-Active SideDrawer-link_icon_quiz"
                                     className="SideDrawer-NavLink"
                                     to="/quizzes"
                                     onClick={() => toggleSideDrawer()}
                            >
                                <i className="SideDrawer-link_icon far fa-question-circle"></i>
                                {/*<i class="SideDrawer-link_icon fas fa-question"></i>*/}
                                <span className="SideDrawer-link_icon_quiz_label">Quizzes</span>
                            </NavLink>
                        </li>

                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink"
                                     to="/conventions"
                                     onClick={() => toggleSideDrawer()}
                            >
                                <i style={{paddingLeft: '.3rem'}} className="SideDrawer-link_icon fas fa-book"></i>
                                <span style={{paddingLeft: '.3rem'}} className="SideDrawer-link_icon_quiz_label">Conventions & System</span>
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink"
                                     to="/tournaments"
                                     onClick={() => toggleSideDrawer()}
                            >
                                <i className="SideDrawer-link_icon fas fa-trophy"></i>
                                Tournaments
                            </NavLink>
                        </li>


                        {/*COMING SOON FEATURES:*/}
                        <li className="SideDrawer-NavLink SideDrawer-Divider">
                            <div className="divider"></div>
                        </li>
                        <li className="SideDrawer-SectionLabel">COMING SOON</li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink onClick={(e) => e.preventDefault()}
                                     activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink SideDrawer-NavLink-Disabled"
                                     to="/questions">
                                <i className="SideDrawer-link_icon far fa-comments"></i>
                                Submit a Question
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink onClick={(e) => e.preventDefault()}
                                     activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink SideDrawer-NavLink-Disabled"
                                     to="/play">
                                {/*<i className="SideDrawer-link_icon material-icons">play_circle_filled</i>*/}
                                <i className="SideDrawer-link_icon fas fa-play-circle"></i>
                                &nbsp;Play Bridge
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink onClick={(e) => e.preventDefault()}
                                     activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink SideDrawer-NavLink-Disabled"
                                     to="/chat">
                                <i className="SideDrawer-link_icon material-icons">chat</i>
                                Live Chat
                            </NavLink>
                        </li>
                        <li className="waves-effect waves-light SideDrawer-NavLink-Li">
                            <NavLink onClick={(e) => e.preventDefault()}
                                     activeClassName="SideDrawer-NavLink-Active"
                                     className="SideDrawer-NavLink SideDrawer-NavLink-Disabled"
                                     to="/bidding">
                                {/*<i className="SideDrawer-link_icon fas fa-home"></i>*/}
                                {/*<i className="SideDrawer-link_icon fas fa-hands-helping"></i>*/}
                                <i className="SideDrawer-link_icon fas fa-exchange-alt"></i>
                                &nbsp;Bid with a Pro
                            </NavLink>
                        </li>



                        {/*<br/>*/}
                        <li className="SideDrawer-NavLink SideDrawer-Divider">
                            <div className="divider"></div>
                        </li>
                        {/*<br/>*/}
                        <div className="SideDrawer-MinorLinks">
                        <span className="SideDrawer-MinorLink">
                            <Link to="/about" className="black-text text-lighten-3">About&nbsp;&nbsp;</Link>
                        </span>
                        <span className="SideDrawer-MinorLink">
                            {/*<a className="grey-text text-lighten-3" href="#!">Contact us</a>*/}
                            { uid &&
                            <Link to="/contact" className="black-text text-lighten-3">Contact Us&nbsp;&nbsp;</Link>
                            }
                        </span>
                        <span className="SideDrawer-MinorLink">
                            <Link to="/privacy" className="black-text text-lighten-3">Privacy Policy&nbsp;&nbsp;</Link>
                        </span>
                        </div>

                        {/*<li className="SideDrawer-NavLink-Li">*/}
                          {/*<NavLink activeClassName="SideDrawer-NavLink-Active SideDrawer-link_icon_quiz"*/}
                                   {/*className="SideDrawer-NavLink" to="/questions">*/}
                              {/*<i className="SideDrawer-link_icon material-icons">question_answer</i>*/}
                              {/*<span className="SideDrawer-link_icon_quiz_label">*/}
                                  {/*Submit a Question*/}
                              {/*</span>*/}
                          {/*</NavLink>*/}
                        {/*</li>*/}

                        {/*<li className="SideDrawer-NavLink-Li">*/}
                        {/*<Link className="SideDrawer-NavLink" to="/forums">Forums</Link>*/}
                        {/*</li>*/}

                    </ul>
                </div>

                <img className="SideDrawer-Logo" src={logo}/>
            </div>

        </div>
    )
}

export default SideDrawer;