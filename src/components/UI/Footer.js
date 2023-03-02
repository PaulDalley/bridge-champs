import React from 'react';
import { Footer } from 'react-materialize';
import './Footer.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const photo = require('../../assets/images/logo-small-inv-t-greybg.png');

const footer = (props) => {
    // console.log("IN FOOTER WITH UID", props.uid);
    return (
            <Footer
                    copyrights="&copy; 2018 All rights reserved"
                    className="Footer"
                    moreLinks={
                        <a className="grey-text text-lighten-4 right" href="#!"></a>
                    }
                    links={
                        <ul>
                            <li>
                                <Link to="/about" className="grey-text text-lighten-3">About</Link>
                            </li>
                            <li>
                                {/*<a className="grey-text text-lighten-3" href="#!">Contact us</a>*/}
                                { props.uid &&
                                    <Link to="/contact" className="grey-text text-lighten-3">Contact Us</Link>
                                }
                            </li>
                            <li>
                                <Link to="/privacy" className="grey-text text-lighten-3">Privacy Policy</Link>
                            </li>
                            {/*<li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>*/}
                            {/*<li><a className="grey-text text-lighten-3" href="#!">Link 3</a></li>*/}
                            {/*<li><a className="grey-text text-lighten-3" href="#!">Link 4</a></li>*/}
                        </ul>

                    }

            >
                <h5 className="white-text">
                    <img className="Footer-logo" src={photo}/>
                </h5>
                <p className="grey-text text-lighten-4">Insights from World Class experts.</p>
            </Footer>
        );
}
export default connect(
    ({ auth }) => ({ uid: auth.uid }),
    null,
)(footer);

