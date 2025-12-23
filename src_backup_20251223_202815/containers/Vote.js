import React, {Component} from 'react';
import {firebase} from '../firebase/config';
import './Vote.css';


class Vote extends Component {

    render() {
        const upVoteClass = "Vote-upvoted";
        const downVoteClass = "Vote-downvoted";
        //<div style={{zIndex: "3000", position: 'relative', left: '-2rem', top: '-5rem', margin: '0', padding: '0', maxHeight:'7rem'}}>

        return (
            <div className="Vote-container">
                <div onClick={() => {
                    console.log("vote up")
                }}
                     className="Questions-vote-wrapper"
                     style={{position: 'relative', cursor: 'pointer', }}>
                    <i className="fas fa-caret-up Vote-vote"></i>
                </div>

                <div className="Vote-voteCount">2500</div>

                <div onClick={() => {
                    console.log("vote down")
                }}
                     className="Questions-vote-wrapper"
                     style={{position: 'relative', cursor: 'pointer', }}>
                    <i className="fas fa-caret-up Vote-vote Vote-downvote"></i>
                </div>

                {/*<span onClick={() => {*/}
                {/*console.log("vote up")*/}
                {/*}}*/}
                {/*className="Questions-vote-wrapper"*/}
                {/*style={{position: 'relative', cursor: 'pointer', minHeight: '6rem'}}>*/}
                {/*<i className="material-icons Questions-vote">thumb_up</i>*/}
                {/*<span style={{*/}
                {/*position: 'relative',*/}
                {/*top: "-.6rem",*/}
                {/*fontSize: '1.45rem',*/}
                {/*paddingLeft: '.55rem',*/}
                {/*paddingRight: '1.65rem'*/}
                {/*}}>2500</span>*/}
                {/*</span>*/}
                {/*<span onClick={() => {*/}
                {/*console.log("vote down")*/}
                {/*}}*/}
                {/*className="Questions-vote-wrapper"*/}
                {/*style={{position: 'relative', cursor: 'pointer', minHeight: '6rem'}}>                    <i*/}
                {/*className="material-icons Questions-vote">thumb_down</i>*/}
                {/*<span style={{*/}
                {/*position: 'relative',*/}
                {/*top: "-.6rem",*/}
                {/*fontSize: '1.45rem',*/}
                {/*paddingLeft: '.55rem',*/}
                {/*paddingRight: '1.65rem'*/}
                {/*}}>100</span>*/}
                {/*</span>*/}
            </div>
        );
    }
}

export default Vote;