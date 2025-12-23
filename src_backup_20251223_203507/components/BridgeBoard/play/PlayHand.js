import React, {Component} from 'react';
// import svg from '../../../assets/images/svg-cards.svg';
// import { range } from 'lodash';
import "./PlayHand.css";
import Card from './Card';
import {SUIT_NAME_MAPPER} from '../../../helpers/helpers';
// import $ from 'jquery';
// const cardsPath = '../../../assets/images/cards';


// function importAll(r) {
//     return r.keys().map(r);
// }

// const images = importAll(require.context('../../../assets/images/cards', false, /\.(png|jpe?g|svg)$/));


// WORKING BUT NOT NEEDED
// var context = require.context('../../../assets/images/cards-s', true, /\.(png)$/);
// var files = {};
//
// context.keys().forEach((filename)=>{
//     files[filename] = context(filename);
// });


// var context2 = require.context('../../../assets/images/cards2', true, /\.(svg)$/);
// var files2={};
//
// context2.keys().forEach((filename)=>{
//     files2[filename] = context(filename);
// });

//"*S-AK1073*H-1043*D-KQ42*C-9"

// ./#_suit.png
// ./1_club.png
// ./jack, ./queen, ./king,

// const cardColor = {
//     '♠': 'black',
//     '♥': "#8d0018",
//     '♦': "#8d0018",
//     '♣': "black",
// };

const cardMapper = {
    A: "1",
    K: "king",
    Q: "queen",
    J: "jack",
    "1": "10",
    "0": false,
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
}

const suitMapper = {
    "S": "spade",
    "H": "heart",
    "D": "diamond",
    "C": "club",
}

const suitSymbolMapper = {
    "spade": '♠',
    "heart": '♥',
    "diamond": '♦',
    "club": '♣',
}

// club, diamond, heart, spade
class PlayHand extends Component {
    state = {
        clickedCard: undefined,
    }

    // cardClicked = (scoringRank, scoringSuit, rank, suit) => {
    cardClicked = (clickedCard) => {
        // console.log(rank, suit, scoringRank, scoringSuit);

        this.setState({clickedCard});
        // let lastClicked = '.' + this.state.lastClicked;
        // if(this.state.lastClicked !== "") {
        //     $(lastClicked).removeClass('Card-container-item_clicked')
        // }
        //
        // let suitName = SUIT_NAME_MAPPER[suit];
        // console.log("CLICKED SUIT NAME", suitName);
        // let justClicked = '.' + rank + '-' + suitName;
        // const jc = $(justClicked);
        // console.log(jc);
        // // $(justClicked).addClass('Card-container-item_clicked');
        // this.setState({lastClicked: rank+'-'+suitName});

        // console.log(rank, suit);
        if (this.props.passClickedCardUp !== undefined) {
            this.props.passClickedCardUp(clickedCard.scoringRank, clickedCard.scoringSuit);
        }
    }
    // shouldComponentUpdate() {
    //     return false;
    // }

    render() {
        const hand = this.props.hand;
        if (hand === undefined || hand === "") return <div></div>;

        // const hand = "*S-AK1073*H-1043*D-KQ42*C-9";
        // const hand = "*S-AKQJ1098765432-*H-AKQJ1098765432*D-AKQJ1098765432*C-AKQJ1098765432";
        const hands = hand.split("*");
        const cards = hands.slice(1).reduce((acc, nextCards) => {
            let splitHand = nextCards.split("-");
            // return {[suitMapper[splitHand[0]]]: splitHand[1]};
            acc[suitMapper[splitHand[0]]] = splitHand[1];
            return acc;
        }, {});

        const suits = ["spade", "heart", "club", "diamond"];
        const thisHand = [];
        for (let i = 0; i < suits.length; i++) {
            let nextSuit = cards[suits[i]];
            // console.log(nextSuit);
            for (let j = 0; j < nextSuit.length; j++) {
                // console.log(nextSuit[j]);
                let rank = cardMapper[nextSuit[j]];
                let scoringRank = rank;
                switch (nextSuit[j]) {
                    case "A":
                    case "K":
                    case "Q":
                    case "J":
                        scoringRank = nextSuit[j];
                        break;
                }
                if (rank) {
                    thisHand.push({
                        suit: suits[i],
                        rank,
                        // src: `./${rank}_${suits[i]}-s.png`,
                        scoringRank,
                        scoringSuit: suitSymbolMapper[suits[i]],
                        // src: `./${rank}_${suits[i]}.png`
                    });
                }
            }
        }
        // console.log(cards);
        // console.log(thisHand);
        // console.log(Object.keys(cards));

        const handJSX = thisHand.map((card, idx) => (
            <Card key={`${card.rank}_${card.suit}`}
                  suit={card.suit}
                  rank={card.rank}
                // src={files[card.src]}
                  clickHandler={this.cardClicked}
                  firstCard={idx === 0}
                  idx={idx}
                  scoringRank={card.scoringRank}
                  scoringSuit={card.scoringSuit}
                  containerClass={`${card.rank}-${SUIT_NAME_MAPPER[card.scoringSuit]}`}
            />
        ));
        // console.log(files);
        // console.log(files2);
        const {clickedCard} = this.state;
        return (
            <div className="PlayHand-container">
                {/*{*/}
                    {/*this.state.clickedCard !== undefined &&*/}

                        {/*<Card key={`clicked-${clickedCard.rank}_${clickedCard.suit}`}*/}
                              {/*suit={clickedCard.suit}*/}
                              {/*rank={clickedCard.rank}*/}
                            {/*// src={files[card.src]}*/}
                              {/*clickHandler={this.cardClicked}*/}
                              {/*firstCard={false}*/}
                              {/*idx={-1}*/}
                              {/*scoringRank={clickedCard.scoringRank}*/}
                              {/*scoringSuit={clickedCard.scoringSuit}*/}
                              {/*containerClass={`${clickedCard.rank}-${SUIT_NAME_MAPPER[clickedCard.scoringSuit]} Card-container-item_clicked`}*/}
                              {/*outerClass="Card-clickedOne"*/}
                        {/*/>*/}
                {/*}*/}
                {handJSX}
                {/*<img className="PlayHand-card" src={files["./7_heart.png"]} />*/}
                {/*<img className="PlayHand-card" src={files["./7_heart.png"]} />*/}

                {/*<img className="PlayHand-card" src={files["./jack_club.png"]}/>*/}
                {/*<img style={{position: "relative", right: "4.5rem"}}*/}
                {/*className="PlayHand-card"*/}
                {/*src={files["./jack_club-s.png"]}/>*/}

                {/*<Card suit="club"*/}
                {/*rank="jack"*/}
                {/*src={files["./jack_club-s.png"]}*/}
                {/*clickHandler={this.cardClicked}*/}
                {/*firstCard*/}
                {/*/>*/}
            </div>
        );
    };
}
;

export default PlayHand;