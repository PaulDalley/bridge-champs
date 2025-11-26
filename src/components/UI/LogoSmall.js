import React from 'react';
import './LogoSmall.css';

// new logo: BC with the 4 symbols around it & BridgeChampions
const logosmall = (props) => (
    <div className="logosmall">
        <span className="logosmall-spade black-suit">♣</span>
        <span className="logosmall-diamond red-suit">♦</span>
        <span className="logosmall-club black-suit">♠</span>
        <span className="logosmall-heart red-suit">♥</span>
        <span className="logosmall-text logosmall-B">&nbsp;&nbsp;B</span>
        <span className="logosmall-text logosmall-C">C&nbsp;&nbsp;</span>
        {/*<span className="logosmall-com">.com</span>*/}
    </div>
);

export default logosmall;