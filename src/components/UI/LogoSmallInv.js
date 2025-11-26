import React from 'react';
import './LogoSmallInv.css';

// new logo: BC with the 4 symbols around it & BridgeChampions
const logosmallinv = (props) => (
    <div className="logosmallinv">
        <span className="logosmallinv-spade black-suit">♣</span>
        <span className="logosmallinv-diamond red-suit">♦</span>
        <span className="logosmallinv-club black-suit">♠</span>
        <span className="logosmallinv-heart red-suit">♥</span>
        <span className="logosmallinv-text logosmall-B">&nbsp;&nbsp;B</span>
        <span className="logosmallinv-text logosmall-C">C&nbsp;&nbsp;</span>
        {/*<span className="logosmall-com">.com</span>*/}
    </div>
);

export default logosmallinv;