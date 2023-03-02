import React from 'react';
import './Logo.css';

// new logo: BC with the 4 symbols around it & BridgeChampions
const logo = (props) => (
    <div className="logo">
        <span className="spade black-suit">♣</span>
        <span className="diamond red-suit">♦</span>
        <span className="club black-suit">♠</span>
        <span className="heart red-suit">♥</span>
        <span className="logo-text">BridgeChampions</span>
        {/*<span className="logo-com">.com</span>*/}
    </div>
);

export default logo;