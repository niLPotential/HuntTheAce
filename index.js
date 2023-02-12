const cardObjectDefinitions = [
  { id: 1, imagePath: "/images/card-KingHearts.png" },
  { id: 2, imagePath: "/images/card-JackClubs.png" },
  { id: 3, imagePath: "/images/card-QueenDiamonds.png" },
  { id: 4, imagePath: "/images/card-AceSpades.png" },
];

const aceId = 4;

const cardBackImgPath = "/images/card-back-Blue.png";

const cardContainerElem = document.querySelector(".card-container");

let cards = [];

const playGameButtonElem = document.getElementById("playGame");

const collapsedGridAreaTemplate = '"a a" "a a"';
const cardCollectionCellClass = ".card-pos-a";

const numCards = cardObjectDefinitions.length;

let cardPositions = [];

let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;

const currentGameStatusElem = document.querySelector(".current-status");
const scoreContainerElem = document.querySelector(".header-score-container");
const scoreElem = document.querySelector(".score");
const roundContainerElem = document.querySelector(".header-round-container");
const roundElem = document.querySelector(".round");

const winColor = "green";
const loseColor = "red";
const primaryColor = "black";

let roundNum = 1;
const maxRounds = 4;
let score = 0;

/*
<div class="card">
  <div class="card-inner">
    <div class="card-front">
      <img src="/images/card-JackClubs.png" alt="" class="card-img" />
    </div>
    <div class="card-back">
      <img src="/images/card-back-Blue.png" alt="" class="card-img" />
    </div>
  </div>
</div>
*/

loadGame();

function gameOver() {
  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");

  const gameOverMessage =
    `Game Over! Final Score - <span class="badge">${score}</span>
    Click 'Play Game' button to play again`;

  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    gameOverMessage,
  );

  gameInProgress = false;
  playGameButtonElem.disabled = false;
}

function endRound() {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver();
      return;
    } else startRound();
  }, 3000);
}

function chooseCard(card) {
  if (canChoosseCard()) {
    evaluateCardChoice(card);
    flipCard(card, false);

    setTimeout(() => {
      flipCards(false);
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Card positions revealed",
      );

      endRound();
    }, 500);
    cardsRevealed = true;
  }
}

function calculateScoreToAdd(roundNum) {
  switch (roundNum) {
    case 1:
      return 100;
    case 2:
      return 50;
    case 3:
      return 25;
    default:
      return 10;
  }
}

function calculateScore() {
  const scoreToAdd = calculateScoreToAdd(roundNum);
  score = score + scoreToAdd;
}

function updateScore() {
  calculateScore();
  updateStatusElement(
    scoreElem,
    "block",
    primaryColor,
    `<span class="badge">${score}</span>`,
  );
}

function updateStatusElement(elem, display, color, innerHTML) {
  elem.style.display = display;

  if (arguments.length > 2) {
    elem.style.color = color;
    elem.innerHTML = innerHTML;
  }
}

function outputChoiceFeedback(hit) {
  if (hit) {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      winColor,
      "Hit!! - Well Done!! :)",
    );
  } else {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      loseColor,
      "Missed!! :(",
    );
  }
}

function evaluateCardChoice(card) {
  if (card.id == aceId) {
    updateScore();
    outputChoiceFeedback(true);
  } else {
    outputChoiceFeedback(false);
  }
}

function canChoosseCard() {
  return gameInProgress == true && !shufflingInProgress && !cardsRevealed;
}

function loadGame() {
  createCards();

  cards = document.querySelectorAll(".card");

  playGameButtonElem.addEventListener("click", () => startGame());

  updateStatusElement(scoreContainerElem, "none");
}

function startGame() {
  initializeNewGame();
  startRound();
}

function initializeNewGame() {
  score = 0;
  roundNum = 0;

  shufflingInProgress = false;

  updateStatusElement(scoreContainerElem, "flex");
  updateStatusElement(roundContainerElem, "flex");

  updateStatusElement(
    scoreElem,
    "block",
    primaryColor,
    `Score <span class="badge">${score}</span>`,
  );
  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class="badge">${roundNum}</span>`,
  );
}

function startRound() {
  initializeNewRound();
  collectCards();
  flipCards(true);
  shuffleCards();
}

function initializeNewRound() {
  roundNum++;
  playGameButtonElem.disabled = true;

  gameInProgress = true;
  shufflingInProgress = true;
  cardsRevealed = false;

  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    "Shuffling...",
  );

  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class="badge">${roundNum}</span>`,
  );
}

function collectCards() {
  transformGridArea(collapsedGridAreaTemplate);
  addCardsToGridAreaCell(cardCollectionCellClass);
}

function transformGridArea(areas) {
  cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName) {
  const cellPositionElem = document.querySelector(cellPositionClassName);

  cards.forEach((card, index) => {
    addChildElement(cellPositionElem, card);
  });
}

function flipCard(card, flipToBack) {
  const innerCardElem = card.firstChild;

  if (flipToBack && !innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.add("flip-it");
  } else if (innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.remove("flip-it");
  }
}
function flipCards(flipToBack) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack);
    }, index * 100);
  });
}

function shuffleCards() {
  const id = setInterval(shuffle, 12);
  let shuffleCount = 0;

  function shuffle() {
    randomizeCardPositions();

    if (shuffleCount == 200) {
      clearInterval(id);
      shufflingInProgress = false;
      dealCards();
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Please click the card that you think is the Ace of Spades...",
      );
    } else {
      shuffleCount++;
    }
  }
}

function randomizeCardPositions() {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  const temp = cardPositions[random1 - 1];

  cardPositions[random1 - 1] = cardPositions[random2 - 1];
  cardPositions[random2 - 1] = temp;
}

function dealCards() {
  addCardsToAppropriateCell();
  const areasTemplate = returnGridAreasMappedToCardPos();

  console.log(areasTemplate);
  transformGridArea(areasTemplate);
}

function returnGridAreasMappedToCardPos() {
  let firstPart = "";
  let secondPart = "";
  let areas = "";

  cards.forEach((card, index) => {
    switch (cardPositions[index]) {
      case "1":
        areas = areas + "a ";
        break;
      case "2":
        areas = areas + "b ";
        break;
      case "3":
        areas = areas + "c ";
        break;
      case "4":
        areas = areas + "d ";
        break;
    }

    switch (index) {
      case 1:
        firstPart = areas.substring(0, areas.length - 1);
        areas = "";
        break;
      case 3:
        secondPart = areas.substring(0, areas.length - 1);
        break;
    }
  });
  return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropriateCell() {
  cards.forEach((card) => {
    addCardToGridCell(card);
  });
}

function createCards() {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem);
  });
}

function createCard(cardItem) {
  // create div elements that make up a card
  const cardElem = createElement("div");
  const cardInnerElem = createElement("div");
  const cardFrontElem = createElement("div");
  const cardBackElem = createElement("div");

  // create front and back image elements for a card
  const cardFrontImg = createElement("img");
  const cardBackImg = createElement("img");

  // add class and id to card element
  addClassToElement(cardElem, "card");
  addIdToElement(cardElem, cardItem.id);

  // add class to inner card element
  addClassToElement(cardInnerElem, "card-inner");

  // add class to front card element
  addClassToElement(cardFrontElem, "card-front");

  // add class to back card element
  addClassToElement(cardBackElem, "card-back");

  // add src atribute and appropriate value to img element - back of card
  addSrcToImageElem(cardBackImg, cardBackImgPath);

  // add src atribute and appropriate value to img element - front of card
  addSrcToImageElem(cardFrontImg, cardItem.imagePath);

  // assign class to back image element of back of card
  addClassToElement(cardBackImg, "card-img");

  // assign class to front image element of front of card
  addClassToElement(cardFrontImg, "card-img");

  // add front image element as child element to front of card element
  addChildElement(cardFrontElem, cardFrontImg);

  // add back image element as child element to back of card element
  addChildElement(cardBackElem, cardBackImg);

  // add front card element as child element to inner card element
  addChildElement(cardInnerElem, cardFrontElem);

  // add back card element as child element to inner card element
  addChildElement(cardInnerElem, cardBackElem);

  //add inner card element as child element to card element
  addChildElement(cardElem, cardInnerElem);

  // add card element as child element to appropriate grid cell
  addCardToGridCell(cardElem);

  initializeCardPositions(cardElem);

  attatchClickEventHandlerToCard(cardElem);
}

function attatchClickEventHandlerToCard(card) {
  card.addEventListener("click", () => chooseCard(card));
}

function initializeCardPositions(card) {
  cardPositions.push(card.id);
}

function createElement(elemType) {
  return document.createElement(elemType);
}

function addClassToElement(elem, className) {
  elem.classList.add(className);
}

function addIdToElement(elem, id) {
  elem.id = id;
}

function addSrcToImageElem(imgElem, src) {
  imgElem.src = src;
}

function addChildElement(parentElem, childElem) {
  parentElem.appendChild(childElem);
}

function addCardToGridCell(card) {
  const cardPositionClassName = mapCardIdToGridCell(card);

  const cardPosElem = document.querySelector(cardPositionClassName);

  addChildElement(cardPosElem, card);
}

function mapCardIdToGridCell(card) {
  switch (card.id) {
    case "1":
      return ".card-pos-a";
    case "2":
      return ".card-pos-b";
    case "3":
      return ".card-pos-c";
    case "4":
      return ".card-pos-d";
  }
}
