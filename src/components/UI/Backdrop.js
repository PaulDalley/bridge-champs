import React from 'react';
import './Backdrop.css';

const Backdrop = ({show, backdropClicked}) => (
    show ? <div className="Backdrop" onClick={() => backdropClicked()}></div> : null
);

export default Backdrop;