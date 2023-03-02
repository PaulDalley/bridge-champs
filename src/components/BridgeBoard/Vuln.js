import React from 'react';
import './Vuln.css';

const Vuln = ({ vuln, dealer }) => {
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