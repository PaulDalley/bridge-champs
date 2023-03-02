//void Bid::setBid(string stringBid, Position pla, uint8_t lastLevel, Suit lastSuit, bool lastDoubled, bool lastRedoubled, Position playerWhoBetNormallyLast)
// const Suits = Object.freeze({
//     Clubs:1, Diamonds:2, Hearts:3, Spades:4, NT: 5
// });
// const Position = Object.freeze({
//     North:0, East:1, South:2, West:3
// });
//
// const validateNextPossibleBid = (
//         bid,
//         position,
//         lastLevel,
//         lastSuit,
//         lastRedoubled,
//         lastDoubled,
//         playerWhoBetNormallyLast) => {
//     let player = Position[position];
//     let betType = false;
//     let suit = "NT";
//     let level = 0;
//
//     if (bid == "X") {
//         if(!lastLevel || lastDoubled || lastRedoubled || (player % 2 == playerWhoBetNormallyLast % 2)) return;
//         betType = "X";
//     }
//     else if (bid == "XX")
//     {
//         if(!lastLevel || !lastDoubled || lastRedoubled || (pla % 2 != playerWhoBetNormallyLast % 2)) return;
//         betType = "XX";
//     }
//     else if(bid == "P" || bid == "") betType = "P";
//     else
//     {
//         if(bid.length() < 2 || bid.length() > 3) return;
//         if(bid[0] < '1' || bid[0] > '7') return;
//         level = bid[0];
//         if(bid.length() == 2 && (bid[1] == 'C' || bid[1] == 'D' || stringBid[1] == 'H' || stringBid[1] == 'S'))
//         {
//             suit = charToSuit(bid[1]);
//             if(lastLevel > level) return;
//             if(lastLevel == level && lastSuit >= suit) return;
//             betType = 'OK';
//         }
//         else if(bid.length() == 3 && bid[1] == 'N' && bid[2] == 'T')
//         {
//             suit = 'NT';
//             if(lastLevel > level) return;
//             if(lastLevel == level && lastSuit == suit) return;
//             betType = 'OK';
//         }
//     }
//
//     return betType;
// }
//
//
// const iterateOverBidding = (bidding) => {
//     uint8_t firstBidsTable[2][6];	// 1st index is team %2, 2nd is suit
//     for(uint8_t i = 0; i<2; ++i) for(uint8_t j = 1; j<6; ++j) firstBidsTable[i][j] = 10; // Mark as unset (10)
//
//     bool atLeastOneBidMade = false;
//     uint8_t numberOfPass = 0;
//     uint8_t lastBidMade = 0; // team % 2 who bet last
//     uint8_t lastLevel = 0;
//     Suit lastSuit = NoTrump;
//     Position playerPos = dealer;
//     Position playerWhoBetNormallyLast = dealer;
//     bool lastDoubled = false, lastRedoubled = false;
//     Contract contract;
//
//     while(numberOfPass < 3 || (!atLeastOneBidMade && numberOfPass < 4))
//     {
//         Bid bid;
//         do
//         {
//             players[playerPos]->bid(bid, lastLevel, lastSuit, lastDoubled, lastRedoubled, playerWhoBetNormallyLast, bidWar);
//             if(bid.getBetType() == Invalid) cout << "Invalid bet!\n";
//         } while (bid.getBetType() == Invalid);
//         if(!players[playerPos]->getIsHuman())
//         {
//             if(options.AI_bidDelay) this_thread::sleep_for(chrono::milliseconds(options.AI_bidDelay));
//             cout << positionToString(playerPos) << ": " << bid.toString() << "\n";
//         }
//         bidWar.push_back(bid);
//         if(bid.getBetType() == Pass) numberOfPass++;
//         else numberOfPass = 0;
//         if(bid.getBetType() == Normal)
//         {
//             playerWhoBetNormallyLast = playerPos;
//             lastBidMade = playerPos%2;
//             lastSuit = bid.getSuit();
//             lastLevel = bid.getLevel();
//             atLeastOneBidMade = true;
//             if(firstBidsTable[playerPos%2][lastSuit] == 10) firstBidsTable[playerPos%2][lastSuit] = playerPos;
//             lastDoubled = false;
//             lastRedoubled = false;
//         }
//         if(bid.getBetType() == Double) lastDoubled = true;
//         if(bid.getBetType() == Redouble) lastRedoubled = true;
//         playerPos = nextPosition(playerPos);
//     }
//     if(numberOfPass == 4)
//     {
//         contract.setContract(0, NoTrump, North, false, false, vulnerability);
//         return contract;
//     }
//     contract.setContract(lastLevel, lastSuit, Position(firstBidsTable[lastBidMade][lastSuit]), lastDoubled, lastRedoubled, vulnerability);
//     return contract;
// }
