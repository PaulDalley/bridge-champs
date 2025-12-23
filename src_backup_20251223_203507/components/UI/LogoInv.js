import React from 'react';
import './LogoInv.css';

// new logo: BC with the 4 symbols around it & BridgeChampions
const logo = (props) => (
    <div className="logoinv">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span className="logoinv-spade black-suit">♣</span>
        <span className="diamond red-suit">♦</span>
        <span className="logoinv-club black-suit">♠</span>
        <span className="heart red-suit">♥</span>
        <span className="logoinv-text">BridgeChampions</span>
        <span className="logoinv-com">.com</span>
    </div>
);

export default logo;