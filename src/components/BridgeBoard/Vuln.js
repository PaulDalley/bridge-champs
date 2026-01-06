import React from 'react';
import './Vuln.css';

const Vuln = ({ vuln, dealer, bidding }) => {
    // Check if bidding is empty/blank
    const isBiddingEmpty = !bidding || bidding === "" || bidding.length === 0;
    
    // If bidding is empty, show compass points
    if (isBiddingEmpty) {
        return (
            <div className="Vuln-container Vuln-compass">
                <div className="Vuln-compass-point Vuln-compass-north">N</div>
                <div className="Vuln-compass-point Vuln-compass-east">E</div>
                <div className="Vuln-compass-point Vuln-compass-south">S</div>
                <div className="Vuln-compass-point Vuln-compass-west">W</div>
            </div>
        );
    }
    
    // Otherwise, show the normal vulnerability/dealer display
    let positions = ["North", "South", "East", "West"];
    let classNames = {};

    switch(vuln) {
        case 'Nil Vul':
            positions.forEach(pos => {
                classNames[pos] = 'Vuln-Nil'
            });
            break;
        case 'Vul East/West':
            classNames["East"] = 'Vuln-Vul';
            classNames["West"] = 'Vuln-Vul';
            classNames["North"] = 'Vuln-Nil';
            classNames["South"] = 'Vuln-Nil';
            break;
        case 'Vul North/South':
            classNames["North"] = 'Vuln-Vul';
            classNames["South"] = 'Vuln-Vul';
            classNames["East"] = 'Vuln-Nil';
            classNames["West"] = 'Vuln-Nil';
            break;
        case 'All Vul':
            positions.forEach(pos => {
                classNames[pos] = 'Vuln-Vul'
            });
            break;
    }
    let JSX = (
      <div className="Vuln-container">
          <div className="Vuln-board">
          </div>
          { positions.map(pos => (
              <div key={pos} className={classNames[pos] + ' Vuln-' + pos}>
                  { (pos === dealer) && <div className="Vuln-dealer">D</div> }
              </div>
          ))}
      </div>
    );
    return JSX;
};

export default Vuln;