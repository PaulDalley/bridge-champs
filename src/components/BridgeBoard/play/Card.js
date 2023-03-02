import React from 'react';
import './Card.css';

const Card = ({
                  rank,
                  suit,
                  clickHandler,
                  src,
                  firstCard,
                  idx,
                  scoringRank,
                  scoringSuit,
                  color,
                  containerClass,
                  outerClass
              }) => {

    // console.log(firstCard);
    const right = `${idx*-4.8}rem`;
    const styles = {position: "relative", left: right };
    const suitStyles = {color: 'black'};
    let rankStylesClass = "";
    switch(rank) {
        case 'king':
        case 'queen':
        case 'jack':
            rank = rank[0].toUpperCase();
            break;
        case '1':
            rank = "A";
            break;
        case '10':
            rankStylesClass = "Card-10";
            break;
        case '9':
            rankStylesClass = "Card-9";
            break;
    }
    switch(suit) {
        // case 'spade':
        // case 'club':
        //     break;
        case 'diamond':
        case 'heart':
            suitStyles.color = "#8d0018";

    }

    return (
        <span
            className={`Card-container ${outerClass}`}
            style={styles}
            onClick={() => clickHandler({scoringRank, scoringSuit, rank, suit})}
        >
            {/*<img*/}
                 {/*className="PlayHand-card"*/}
                 {/*src={src}*/}
                 {/*onClick={() => clickHandler(scoringRank, scoringSuit)}*/}
            {/*/>*/}
            <div className={`Card-inner_div ${containerClass}`}>
                <div className={`Card-rank ${rankStylesClass}`} style={suitStyles}>{rank}</div>
                <div className="Card-suit-top"style={suitStyles}>{scoringSuit}</div>
                <div className="Card-suit-bottom"style={suitStyles}>{scoringSuit}</div>
            </div>
        </span>
    );
};


export default Card;
