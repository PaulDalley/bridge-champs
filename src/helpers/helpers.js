import React from "react";
import { Markup } from "interweave";
import MakeBoard from "../components/BridgeBoard/MakeBoard";
import database from "../firebase/config";

Array.prototype.unique = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};

const suitRanks = { A: 14, K: 13, Q: 12, J: 11, T: 10 };

export const sortSuitRanks = (x, y) => {
  let xFaceCard = "AKQJT".includes(x);
  let yFaceCard = "AKQJT".includes(y);
  let xValue = xFaceCard ? suitRanks[x] : Number(x);
  let yValue = yFaceCard ? suitRanks[y] : Number(y);
  if (xValue < yValue) return 1;
  else return -1;
};

const filterOutNoncards = (card) => "23456789TJQKA".includes(card);

export const sortCardString = (cards) => {
  if (cards !== "") {
    cards = cards.replace("1", "T");
    cards = cards
      .toUpperCase()
      .split("")
      .filter(filterOutNoncards)
      .unique()
      .sort(sortSuitRanks)
      .join("");
  }
  return cards;
};
export const noDuplicateCardsOfSameSuit = (North, East, South, West, suit) => {
  let concatenatedString = North[suit] + East[suit] + South[suit] + West[suit];
  return (
    concatenatedString.length == concatenatedString.split("").unique().length
  );
};

export const fetchDataChunk = (from, howMany, orderBy) => {
  return database
    .collection(from)
    .orderBy(orderBy, "desc")
    .limit(howMany)
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.id,
          from: from,
          ...childSnapshot.data(),
        });
      });
      return data;
    });
};

export const urlToCategory = (url) => {
  switch (url) {
    case "conventions":
      return "Conventions & Systems";
  }
};

export const getMaxBidFromBiddingString = (bidding) => {
  // console.log(bidding);
  let highestBid = "0♣";
  for (let bid of bidding.reverse()) {
    switch (bid) {
      case "_":
      case "X":
      case "XX":
      case "P":
        break;
      default:
        if (isGreaterBid(bid, highestBid)) {
          highestBid = bid;
        }
    }
  }

  // console.log(highestBid);
  return highestBid;
};

// enemy->partner->enemy->me->enemy
export const canDoubleChecker = (bidding) => {
  // return [true, true];

  // const positions = ["West", "North", "East", "South"];
  // const Position = Object.freeze({
  //     West:0, North:1, East:2, South:3,
  // });
  // const PositionRev = Object.freeze({
  //     0:"West", 1:"North", 2:"East", 3:"South",
  // });

  if (!bidding) return [false, false];

  let canDouble = false;
  let canRedouble = false;

  const numBids = bidding.length;
  let player = numBids % 4;

  let lastLevel = 0;
  let lastDoubled = false;
  let lastRedoubled = false;
  let playerWhoBetNormallyLast;
  let currentPlayer = 0;

  for (let bid of bidding) {
    // console.log(bid);
    switch (bid) {
      case "X":
        lastDoubled = true;
        break;
      case "XX":
        lastRedoubled = true;
        lastDoubled = false;
        break;
      case "P":
        break;
      case "_":
        break;
      default:
        playerWhoBetNormallyLast = currentPlayer;
        lastDoubled = false;
        lastRedoubled = false;
        lastLevel = bid[0] > lastLevel ? (lastLevel = bid[0]) : lastLevel;
      // console.log("UPDATED LASTLEVEL to " + lastLevel);
    }

    currentPlayer = (currentPlayer + 1) % 4;
  }

  // canDouble = (!lastLevel && lastDoubled && lastRedoubled && !(player % 2 == playerWhoBetNormallyLast % 2));
  // canRedouble = (!lastLevel && !lastDoubled && lastRedoubled && (player % 2 != playerWhoBetNormallyLast % 2));

  // Negated Disjunction:
  // canDouble = !(!lastLevel || lastDoubled || lastRedoubled || !(player % 2 == playerWhoBetNormallyLast % 2));
  // canRedouble = !(!lastLevel || !lastDoubled || lastRedoubled || (player % 2 != playerWhoBetNormallyLast % 2));

  const myTeam = player % 2;

  // Positive Conjunction:
  canDouble =
    lastLevel &&
    !lastDoubled &&
    !lastRedoubled &&
    !(player % 2 == playerWhoBetNormallyLast % 2);

  canRedouble =
    lastLevel &&
    lastDoubled &&
    !lastRedoubled &&
    player % 2 === playerWhoBetNormallyLast % 2;

  // let shits = [lastLevel, lastDoubled, lastRedoubled, (player % 2 == playerWhoBetNormallyLast % 2)];
  // console.log(shits);

  // let canDoubleArr = [!lastLevel, lastDoubled, lastRedoubled, !(player % 2 == playerWhoBetNormallyLast % 2)];
  // let canRedoubleArr = [!lastLevel, !lastDoubled, lastRedoubled, (player % 2 != playerWhoBetNormallyLast % 2)];
  // console.log([lastLevel, lastDoubled, lastRedoubled, player, playerWhoBetNormallyLast]);
  // console.log(canDoubleArr);
  // console.log(canRedoubleArr);

  return [canDouble, canRedouble];
};

// 1) Cant double your partner
// 2) Cant double a double or a redouble
// 1) Cant redouble your partner
// 2) Can only redouble if last bid was a double and made by your opponents.

export const prepareArticleString = (article) => {
  return article
    .split("&gt;")
    .join(">")
    .split("&lt;")
    .join("<")
    .split(/(![shcdSHCD])/)
    .map((substr) => replaceSuitMacros(substr))
    .join("")
    .split(/(<MakeBoard .* \/>)/)
    .map((substr) => replaceDiamondsAndHearts(substr))
    .join("");
};

const iterativelyReplace = (string, suit) => {
  let oldString = string;
  let newString = "";
  let indexOf = oldString.indexOf(suit);
  while (indexOf !== -1) {
    newString += oldString.slice(0, indexOf);
    oldString = oldString.slice(indexOf + 1);
    // console.log(newString);
    // console.log(oldString);

    // oldString.slice(0, 7) !== '</span>';
    // console.log(oldString.slice(0, 6));
    if (
      oldString.slice(0, 7) !== "</span>" &&
      oldString[0] !== "/" &&
      oldString[0] !== '"'
    ) {
      newString += `<span className='red-suit'>${suit}</span>`;
    } else {
      newString += suit;
    }
    indexOf = oldString.indexOf(suit);
  }
  if (newString === "") return oldString;
  return (newString += oldString);
};

const replaceDiamondsAndHearts = (substr) => {
  if (!substr.includes("MakeBoard")) {
    let newStr = iterativelyReplace(substr, "♥");
    // console.log(newStr);
    newStr = iterativelyReplace(newStr, "♦");
    // console.log(newStr);
    return newStr;
  } else {
    return substr;
  }
};

export const replaceSuitMacros = (substr) => {
  switch (substr) {
    case "!c":
    case "!C":
      return "♣";
    case "!d":
    case "!D":
      return "♦";
    // return `<span className='red-suit'>♦</span>`;
    case "!h":
    case "!H":
      return "♥";
    // return `<span className='red-suit'>♥</span>`;
    case "!s":
    case "!S":
      return "♠";
    default:
      return substr;
  }
};

export const SUITS = ["♣", "♦", "♥", "♠", "NT"];
const orderedSides = ["West", "North", "East", "South"];
export const SUIT_VALUE_MAPPER = {
  "♣": 1,
  "♦": 2,
  "♥": 3,
  "♠": 4,
  NT: 5,
};
export const SUIT_NAME_MAPPER = {
  "♣": "club",
  "♦": "diamond",
  "♥": "heart",
  "♠": "spade",
  NT: "NT",
};

export const isGreaterBid = (currentMaxBid, newBid) => {
  let isGreater = false;
  if (currentMaxBid[0] > newBid[0]) {
    // isGreater = true;
    return true;
  } else if (currentMaxBid[0] === newBid[0]) {
    // isGreater = compareSuits(currentMaxBid.slice(1), newBid.slice(1));
    return compareSuits(currentMaxBid.slice(1), newBid.slice(1));
  }
  // console.log(currentMaxBid, newBid, isGreater);
  // return isGreater;
  return false;
};

export const compareSuits = (leftSuit, rightSuit) => {
  return SUIT_VALUE_MAPPER[leftSuit] >= SUIT_VALUE_MAPPER[rightSuit];
};

export const getWhoBidWhatSuitFirst = (bids) => {
  const whoBidFirst = {
    "♣": false,
    "♦": false,
    "♥": false,
    "♠": false,
    NT: false,
  };

  const bidding = bids.split("/");
  for (let i = 0; i < bidding.length; i++) {
    let bid;
    switch (bidding[i]) {
      case "P":
      case "XX":
      case "X":
      case "_":
        continue;
        break;
      default:
        bid = getSuitFromBid(bidding[i]);
    }
    if (bid && !whoBidFirst[bid]) {
      whoBidFirst[bid] = orderedSides[i % 4];
    }
  }
  return whoBidFirst;
};

export const getLastBid = (bids) => {
  let bidding = bids.split("/");
  let lastBid;
  let idx = bidding.length - 1;
  // let idx = bidding.length-1;
  for (; idx >= 0; idx--) {
    switch (bidding[idx]) {
      case "P":
      case "XX":
      case "X":
      case "_":
        continue;
        break;
      default:
        lastBid = getSuitFromBid(bidding[idx]);
        break;
    }
    if (lastBid) {
      break;
    }
  }
  return [lastBid, orderedSides[idx % 4]];
  // orderedSides;
};

export const getSuitFromBid = (bid) => {
  return bid.slice(1);
};

export const sortCategoryArticlesByLevelAndArticleNumber = (articles) => {
  // Sort numbers in ascending order:
  //.sort((a, b) => return a - b)
  const compareFnByArticleNumber = (a, b) =>
    Number(a?.articleNumber) - Number(b?.articleNumber);

  const intermediateValue = articles.reduce((acc, next, idx) => {
    const difficulty = next?.difficulty;
    if (acc?.[difficulty] === undefined) {
      acc[difficulty] = [next];
      return acc;
    } else {
      acc[difficulty].push(next);
      return acc;
    }
  }, {});

  const finalResults = [];

  for (const [key, value] of Object.entries(intermediateValue)) {
    const newArr = [...value];
    newArr.sort(compareFnByArticleNumber);
    finalResults.push(newArr);
  }

  const flattenedResults = finalResults.flat();

  // console.log("--- FROM HELPERS sortCategory ---");
  // console.log(articles);
  // console.log(intermediateValue);
  // console.log(finalResults);
  // console.log(flattenedResults);

  return flattenedResults;
};

export const filterCategoryArticles = (
  articlesArray,
  { category, difficulty, searchString }
) => {
  if (
    // category == '""' &&
    difficulty == '""' &&
    (searchString == "" || searchString == '""')
  ) {
    return articlesArray;
  }

  return articlesArray.filter((article) => {
    let categoriesMatch = true;
    let difficultiesMatch = true;
    let searchStringMatch = true;

    let toSearch;
    if (searchString && searchString !== '""') {
      toSearch = [
        article.category,
        getDifficultyStr(article.difficulty),
        article.title,
        article.teaser,
      ]
        .join(" ")
        .toLowerCase();
      searchStringMatch = toSearch.includes(searchString.toLowerCase());
    }

    if (category && category !== '""') {
      categoriesMatch = article.category === category;
    }
    if (difficulty && difficulty !== '""') {
      difficultiesMatch = article.difficulty === difficulty;
    }
    // return categoriesMatch && difficultiesMatch && searchStringMatch;
    return difficultiesMatch && searchStringMatch;
  });
};

export const filterArticles = (
  articlesArray,
  { category, difficulty, searchString }
) => {
  // console.log(articlesArray);
  // console.log(category, difficulty, searchString);
  // console.log(searchString == "");
  if (
    category == '""' &&
    difficulty == '""' &&
    (searchString == "" || searchString == '""')
  ) {
    // console.log("IN HERE");
    // console.log(articlesArray);
    return articlesArray;
  }

  return articlesArray.filter((article) => {
    let categoriesMatch = true;
    let difficultiesMatch = true;
    let searchStringMatch = true;

    let toSearch;
    if (searchString && searchString !== '""') {
      toSearch = [
        article.category,
        getDifficultyStr(article.difficulty),
        article.title,
        article.teaser,
      ]
        .join(" ")
        .toLowerCase();
      searchStringMatch = toSearch.includes(searchString.toLowerCase());
    }

    if (category && category !== '""') {
      categoriesMatch = article.category === category;
    }
    if (difficulty && difficulty !== '""') {
      difficultiesMatch = article.difficulty === difficulty;
    }
    return categoriesMatch && difficultiesMatch && searchStringMatch;
  });
};

const filterByQuizScores = (articles, quizScores) => {
  if (quizScores !== undefined) {
    return articles.filter((article) => {
      return quizScores[article.body] === undefined;
    });
  } else {
    return articles;
  }
};

export const filterQuizzes = (
  articlesArray,
  { category, difficulty, searchString, hide, quizScores = {} },
  quizScoresDB
) => {
  // console.log(quizScores);
  // console.log(hide);
  // console.log(articlesArray);
  // console.log(category, difficulty, searchString);
  // console.log(searchString == "");
  if (
    category == '""' &&
    difficulty == '""' &&
    (searchString == "" || searchString == '""')
  ) {
    // console.log("IN HERE");
    // console.log(articlesArray);
    if (hide) return filterByQuizScores(articlesArray, quizScoresDB);
    else return articlesArray;
  }

  return articlesArray.filter((article) => {
    let categoriesMatch = true;
    let difficultiesMatch = true;
    let searchStringMatch = true;
    let showCompleted = true;
    let showCompletedDB = true;

    let toSearch;
    if (searchString !== '""') {
      toSearch = [
        article.quizType,
        getDifficultyStr(article.difficulty),
        article.title,
        article.teaser,
      ]
        .join(" ")
        .toLowerCase();
      searchStringMatch = toSearch.includes(searchString.toLowerCase());
    }

    if (category !== '""') {
      categoriesMatch = article.quizType === category;
    }
    if (difficulty !== '""') {
      difficultiesMatch = article.difficulty === difficulty;
    }

    if (hide && quizScores !== undefined) {
      showCompleted = quizScores[article.body] === undefined;
      showCompletedDB = quizScoresDB[article.body] === undefined;
      // if (article.title === "Add to favourites") {
      //     console.log(quizScores[article.body]);
      //     console.log(quizScoresDB[article.body]);
      //     console.log("SHOULD BE HIDDEN");
      //     console.log(showCompleted);
      // }
    }

    return (
      showCompletedDB &&
      showCompleted &&
      categoriesMatch &&
      difficultiesMatch &&
      searchStringMatch
    );
  });
};

export const makeDateString = (date) => {
  if (date) {
    try {
      let dateData = date.toDate();
      let dateString = dateData.toString().split(" ");
      //   console.log("--- CONVERTING date.toDate() ---");
      //   console.log(dateData);
      //   console.log(dateString);
      return `${dateString[0].slice(0, 3)} ${dateString[1]} ${dateString[2]}, ${
        dateString[3]
      }`;
    } catch (e) {
      //   console.log("--- ERROR CONVERTING DATE FROM FIREBASE ---");
      //   console.log(e);
      //   console.log(date);
      //   console.log(typeof date);
      let dateData = new Date().toString().split(" ");
      return `${dateData[0].slice(0, 3)} ${dateData[1]} ${dateData[2]}, ${
        dateData[3]
      }`;
    }
  }
  // let dateData;
  // if (date)
  //     dateData = date.toString().split(" ");
  // else {
  //     dateData = (new Date().toString().split(" "));
  // }
  // return `${dateData[0].slice(0, 3)} ${dateData[1]} ${dateData[2]}`;
};

export const makeBoardObjectFromString = (boardString, showVuln = false) => {
  // console.log(boardString);
  if (boardString === "") return undefined;
  try {
    // console.log(boardString);
    let board = boardString.trim().split(" ");
    // console.log(board);
    board[7] += " " + board[8];
    board = board.slice(1, -1);
    const data = {};

    // console.log(board);

    board.forEach((each, idx) => {
      if (board[idx].includes("=")) {
        let [key, value] = each.split("=");

        if (value) {
          data[key] = value.slice(1, -1);
        }
        // if (value === undefined) {
        //     console.log("value broken for some reason");
        //     console.log(data);
        //     console.log(idx);
        // }
      }
    });
    data["showVuln"] = showVuln;
    // console.log("--- board object from string ---");
    // console.log(data);
    return data;
  } catch (e) {
    return "";
  }
};

export const findArticleById = (data, id) => {
  if (data === undefined) return {};
  const res = data.find((el) => el.body === id);
  return res;
  // return data.find(el => el.body === id);
};

export const findQuizById = (data, id) => {
  const res = data?.find((el) => el.id === id);
  return res;
  // return data.find(el => el.body === id);
};

export const getLevelStr = (levelNumber) => {
  let levelStr = "";
  return `Level ${levelNumber}`;
};

export const getDifficultyStr = (difficulty) => {
  let diffString;
  switch (difficulty) {
    case "":
      diffString = "";
      break;
    case "general":
      diffString = "General";
      break;
    case "adv":
      diffString = "Advanced";
      break;
    case "int":
      diffString = "Intermediate";
      break;
    case "beg":
      diffString = "Improver";
      break;
  }

  return diffString;
};

export const getQuizData = (documentString) => {
  // console.log("--- Making board from document string ---");
  // console.log(documentString);
  // console.log(documentString.split(/(<MakeBoard .* \/>)/));
  const re = /(<MakeBoard .* \/>)/;
  const matches = re.exec(documentString);
  if (matches) {
    const boardString = matches[0];
    return makeBoardObjectFromString(boardString);
  }
};

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    // Try regex fallback for URLs that might not parse correctly
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match) return match[1];
  }
  
  return null;
};

// Helper function to render video embed with premium gating
const renderVideoEmbed = (videoUrl, key, tier, history) => {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  
  const isPremium = tier === 'premium';
  
  if (isPremium) {
    return (
      <div key={key} className="Article-video-container" role="region" aria-label="Video content">
        <iframe
          className="Article-video-player"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Article video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          aria-label="YouTube video player"
        />
      </div>
    );
  } else {
    // Non-premium users see paywall
    return (
      <div key={key} className="Article-video-container">
        <div className="Article-video-paywall">
          <div className="Article-video-blur">
            <div className="Article-video-lock-icon">🔒</div>
          </div>
          <div className="Article-video-paywall-content">
            <h3>Premium Content</h3>
            <p>Upgrade to Premium to watch this video</p>
            <button
              className="Article-video-upgrade-btn"
              onClick={() => history.push('/membership')}
              aria-label="Upgrade to premium membership to watch this video"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }
};

// Helper function to detect if article has videos
export const hasVideosInContent = (documentString) => {
  if (!documentString) return false;
  const videoTagRegex = /<Video\s+url=["']([^"']+)["']\s*\/>|<Video>([^<]+)<\/Video>/gi;
  const youtubeUrlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:[^\s<>"']*)?)/gi;
  return videoTagRegex.test(documentString) || youtubeUrlRegex.test(documentString);
};

export const parseDocumentIntoJSX = (
  documentString,
  quiz = false,
  callback = undefined,
  quizType = undefined,
  tier = undefined,
  history = undefined
) => {
  if (!documentString) return [];
  
  // First, split by video tags/patterns, then by MakeBoard tags
  // Support both <Video url="..." /> and <Video>...</Video> formats
  // Also support YouTube URLs directly in text
  let parts = [];
  let currentIndex = 0;
  let partIndex = 0;
  
  // Regex to match video tags and YouTube URLs
  const videoTagRegex = /<Video\s+url=["']([^"']+)["']\s*\/>|<Video>([^<]+)<\/Video>/gi;
  // Updated regex to match YouTube URLs even when wrapped in HTML tags or with query parameters
  // This will match URLs like: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  // Even if they're inside <p> tags or have additional query parameters
  const youtubeUrlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:[^\s<>"']*)?)/gi;
  
  // Find all video matches
  const videoMatches = [];
  let match;
  
  // Match video tags
  while ((match = videoTagRegex.exec(documentString)) !== null) {
    videoMatches.push({
      index: match.index,
      length: match[0].length,
      url: match[1] || match[2],
      type: 'tag'
    });
  }
  
  // Match YouTube URLs (but not if they're already in video tags)
  while ((match = youtubeUrlRegex.exec(documentString)) !== null) {
    // Check if this URL is already captured in a video tag
    const isInTag = videoMatches.some(vm => 
      match.index >= vm.index && match.index < vm.index + vm.length
    );
    
    if (!isInTag) {
      videoMatches.push({
        index: match.index,
        length: match[0].length,
        url: match[0],
        type: 'url'
      });
    }
  }
  
  // Sort matches by index
  videoMatches.sort((a, b) => a.index - b.index);
  
  // Split document by video matches and MakeBoard tags
  let processedString = documentString;
  let offset = 0;
  
  // Replace video matches with placeholders
  const videoPlaceholders = [];
  videoMatches.forEach((vm, idx) => {
    const placeholder = `__VIDEO_PLACEHOLDER_${idx}__`;
    videoPlaceholders.push({
      placeholder,
      url: vm.url
    });
    processedString = processedString.substring(0, vm.index + offset) + 
                     placeholder + 
                     processedString.substring(vm.index + vm.length + offset);
    offset += placeholder.length - vm.length;
  });
  
  // Now split by MakeBoard tags
  const segments = processedString.split(/(<MakeBoard\s.*?\s\/>)/);
  
  // Process each segment
  const articleDataArray = [];
  let globalIdx = 0;
  
  segments.forEach((segment, segIdx) => {
    if (segment.includes("MakeBoard")) {
      // Render MakeBoard
      articleDataArray.push(
        <div key={`board-${globalIdx}`} className="Display-board_container">
          <br />
          <MakeBoard
            {...makeBoardObjectFromString(segment, true)}
            getBidding={callback}
            isQuiz={quiz}
            quizType={quizType}
          />
          <br />
        </div>
      );
      globalIdx++;
    } else if (segment.includes("__VIDEO_PLACEHOLDER_")) {
      // Extract placeholder index and render video
      const placeholderMatch = segment.match(/__VIDEO_PLACEHOLDER_(\d+)__/);
      if (placeholderMatch) {
        const placeholderIdx = parseInt(placeholderMatch[1]);
        const videoData = videoPlaceholders[placeholderIdx];
        if (videoData) {
          const videoEmbed = renderVideoEmbed(videoData.url, `video-${globalIdx}`, tier, history);
          if (videoEmbed) {
            articleDataArray.push(videoEmbed);
            globalIdx++;
          }
        }
        // Remove placeholder from segment before rendering as Markup
        segment = segment.replace(/__VIDEO_PLACEHOLDER_\d+__/g, '');
      }
      
      // Render remaining content as Markup if there's any
      if (segment.trim()) {
        articleDataArray.push(<Markup key={`content-${globalIdx}`} content={segment} />);
        globalIdx++;
      }
    } else if (segment.trim()) {
      // Regular content
      articleDataArray.push(<Markup key={`content-${globalIdx}`} content={segment} />);
      globalIdx++;
    }
  });
  
  return articleDataArray;
};

// const bindings = {};
// const re = /<MakeBoard .*\/>/;
// let matches;
// let articleDataArray = [];
// let curIdx = 0;
// let id = 0;
// let strRemaining;
// if (documentString) {
//     strRemaining = documentString.slice(curIdx);
//     do {
//         strRemaining = strRemaining.slice(curIdx);
//         console.log(strRemaining);
//         matches = re.exec(strRemaining);
//         console.log(matches);
//         if (matches) {
//             let boardStrLen = matches[0].length;
//             console.log(boardStrLen);
//             let strBefore = matches.input.slice(0, matches.index);
//             let boardStr = matches[0];
//             curIdx = matches.index + boardStrLen;
//             articleDataArray.push(<Markup key={id} content={strBefore}/>);
//             id += 1
//             articleDataArray.push(
//                 <div key={id} className="Display-board_container">
//                     <br/>
//                     <br/>
//                     <MakeBoard {...makeBoardObjectFromString(boardStr, true)}
//                                getBidding={callback}
//                                isQuiz={quiz}
//                                quizType={quizType}
//                     />
//                 </div>
//             );
//             id += 1
//         }
//     } while (matches);
//     // articleDataArray.push(<Markup key={id+1} content={strRemaining.slice(curIdx)} />);
//     articleDataArray.push(<Markup key={id+1} content={strRemaining} />);
//     return articleDataArray;
//     }
// };
