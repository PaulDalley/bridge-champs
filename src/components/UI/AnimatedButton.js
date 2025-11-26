import React from 'react';
import './AnimatedButton.css';
import $ from 'jquery';


const AnimatedButton = ({ buttonText,
                            jumpTo,
                            color,
                            history,
                            gotoOnClick,
                            scrollTo=undefined,
                            whenClicked=undefined,
                            extraContent=undefined,
                        }) => {
    let button;

    if (scrollTo) {
        button = <a href={`#${jumpTo}`}
                    onClick={() => $('html, body').animate({
                        scrollTop: $(`${scrollTo}`).offset().top
                    }, 2000)}
                    className={`AnimatedButton AnimatedButton--${color} AnimatedButton--animated`}>
            {buttonText}</a>
    }
    else if (typeof gotoOnClick === "string") {
        button = <a href=""
                    onClick={() =>  history.push(gotoOnClick)}
                    className={`AnimatedButton AnimatedButton--${color} AnimatedButton--animated`}>
                    {buttonText}
            </a>
    }
    else if (whenClicked) {
        button = <a href=""
                    onClick={(e) => { e.preventDefault(); whenClicked(); }}
                    className={`AnimatedButton AnimatedButton--${color} AnimatedButton--animated`}>
            {buttonText}
        </a>
    }


    return (
        <div style={{ zIndex: '1001'}}>
         {button}
            {extraContent &&
                <div className="Walkthrough-stepBox"
                     style={{
                         position: 'absolute',
                         top: '2rem',
                         // right: '0',
                     }}
                >
                <div className="Walkthrough-stepBox-header"
                     style={{fontSize: '1.6rem !important'}}>{extraContent}</div>
                    <hr style={{
                    textAlign: 'center',
                    backgroundColor: "#8d0018",
                    height: '.45rem',
                    width: "95%",
                    fontSize: "3rem",
                }}/>
                </div>}
        </div>
    );
};

{/*<a href={`#${jumpTo}`} className="AnimatedButton AnimatedButton-text AnimatedButton--white AnimatedButton--animated">{buttonText}</a>*/}

export default AnimatedButton;