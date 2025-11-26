import React, { Component } from 'react';
import MakeBoard from './BridgeBoard/MakeBoard';

//Ss53HmNpde0in8d5zQfw
class TestingGround extends Component {
    render() {
        return (
          <div>
              HI TESTING
              <span>zzz
              </span>
              <MakeBoard boardType="double" position="North/South" North="*S-K10742*H-QJ93*D-AK2*C-2" East="*S-*H-*D-*C-" South="*S-AQ4*H-K73*D-J10852*C-QJ" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="South" bidding="_/_/_/1♣/P/1♠/P/1NT/P/2♦/P/2♠/P/4♠/P/P/P" />

          </div>
        );
    }
}
export default TestingGround;