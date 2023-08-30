// Game Logic
class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.toElement = () => {
            if (this == null || this === undefined) {
                console.log('Card is null');
            }
            let c = document.createElement('div');
            c.classList.add('card');
            let url = 'url("Assets/Cards/';
            if (
                this.suit < 0 ||
                this.suit > 3 ||
                this.value < 1 ||
                this.value > 13
            ) {
                url += 'back';
            } else {
                switch (this.suit) {
                    case 0:
                        url += 'spades_';
                        break;
                    case 1:
                        url += 'hearts_';
                        break;
                    case 2:
                        url += 'clubs_';
                        break;
                    case 3:
                        url += 'diamonds_';
                        break;
                }
                switch (this.value) {
                    case 1:
                        url += 'ace';
                        break;
                    case 11:
                        url += 'jack';
                        break;
                    case 12:
                        url += 'queen';
                        break;
                    case 13:
                        url += 'king';
                        break;
                    default:
                        url += this.value;
                        break;
                }
            }
            url += '.svg")';
            c.style.backgroundImage = url;
            return c;
        };
    }

    // Return a string in the form "${rank} of ${suit}
    toString() {
        let c = '';
        switch (this.value) {
            case 1:
                c += 'A of ';
                break;
            case 11:
                c += 'J of ';
                break;
            case 12:
                c += 'Q of ';
                break;
            case 13:
                c += 'K of ';
                break;
            default:
                c += this.value + ' of ';
                break;
        }

        switch (this.suit) {
            case 0:
                c += 'Spades';
                break;
            case 1:
                c += 'Hearts';
                break;
            case 2:
                c += 'Clubs';
                break;
            case 3:
                c += 'Diamonds';
                break;
        }

        return c;
    }
}

const suitMap = {
    S: 0,
    H: 1,
    C: 2,
    D: 3,
};
let deck = [];
let allCards = [];
let hand = [null, null];
let board = [null, null, null, null, null];
let numBoards = 0;

function init_game() {
    deck = [];
    for (let i = 0; i < 4; ++i) {
        for (let j = 1; j <= 13; ++j) {
            const c = new Card(j, i);
            deck.push(c);
            allCards.push(c);
        }
    }
    shuffle();

    hand[0] = deck.pop();
    hand[1] = deck.pop();
}

// Randomly shuffles deck
function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function handStrength() {
    let strength = 0;
    let straight = false;
    let flushSuit = 0;
    let histo = new Array(13).fill(0);
    let suits = new Array(4).fill(0);

    for (let i = 0; i < 5; ++i) {
        const c = board[i];
        ++histo[c.value - 1];
        ++suits[c.suit - 1];
    }

    for (let i = 0; i < 2; ++i) {
        const c = hand[i];
        ++histo[c.value - 1];
        ++suits[c.suit - 1];
    }

    // Checks for Flush
    for (let i = 0; i < 4; ++i) {
        if (suits[i] >= 5) {
            strength = 5;
            flushSuit = i + 1;
        }
    }

    // Checks for Pair, Two Pair, Trips, Straight, Quads
    for (let i = 0, counter = 0; i < 13; ++i) {
        if (histo[i] !== 0) {
            ++counter;
        } else {
            counter = 0;
        }
        if (counter >= 5) {
            strength = Math.max(4, strength);
            straight = true;
        }

        if (histo[i] === 2) {
            switch (strength) {
                case 0:
                case 1:
                    strength++;
                    break;
                case 3:
                    strength = 6;
                    break;
            }
        }
        if (histo[i] === 3) {
            switch (strength) {
                case 0:
                    strength = 3;
                    break;
                case 1:
                case 2:
                    strength = 6;
            }
        }
        if (histo[i] === 4) {
            strength = 7;
        }
    }

    // Check broadway Straight
    if (
        histo[0] !== 0 &&
        histo[9] !== 0 &&
        histo[10] !== 0 &&
        histo[11] !== 0 &&
        histo[12] !== 0
    ) {
        strength = Math.max(4, strength);
        straight = true;
    }

    // Checks straight and royal flush
    if (straight && flushSuit !== 0) {
        histo.fill(0);
        for (let c in board) {
            if (c.suit === flushSuit) {
                ++histo[c.value - 1];
            }
        }
        for (let c in board) {
            if (c.suit === flushSuit) {
                ++histo[c.value - 1];
            }
        }
        for (let i = 0, counter = 0; i < 13; ++i) {
            if (histo[i] !== 0) {
                ++counter;
            } else {
                counter = 0;
            }
            if (counter >= 5) {
                strength = 8;
            }
        }

        if (
            histo[0] !== 0 &&
            histo[9] !== 0 &&
            histo[10] !== 0 &&
            histo[11] !== 0 &&
            histo[12] !== 0
        ) {
            strength = 9;
        }
    }

    switch (strength) {
        case 1:
            return 'Pair';
        case 2:
            return 'Two Pair';
        case 3:
            return 'Three of a Kind';
        case 4:
            return 'Straight';
        case 5:
            return 'Flush';
        case 6:
            return 'Full House';
        case 7:
            return 'Four of a Kind';
        case 8:
            return 'Straight Flush';
        case 9:
            return 'Royal Flush';
        default:
            return 'High Card';
    }
}

function colorStatus(c) {
    let value = c.value;
    let suit = c.suit;
    let cards = [hand[0].value, hand[1].value];
    let suits = [hand[0].suit, hand[1].suit];
    if (
        (value === cards[0] && suit === suits[0]) ||
        (value === cards[1] && suit === suits[1])
    )
        return 'green';
    if (
        value === cards[0] ||
        value === cards[1] ||
        suit === suits[0] ||
        suit === suits[1]
    )
        return 'yellow';
    return 'red';
}

// User Interface

const screen = document.getElementById('screen');
let backFile = 'url("Assets/Cards/back.svg")';
let guesses = [];
let curGuess = [];
let suitBtns = [];
let rankBtns = [];
let submitBtn = document.getElementById('submit');
let resetBtn = document.getElementById('reset');

// Reset Guess
resetBtn.addEventListener('click', () => {
    curGuess = [];
    guesses[numBoards - 1][0].style.backgroundImage = backFile;
    guesses[numBoards - 1][1].style.backgroundImage = backFile;
});

// Changing selected suit
let curSuit = 0;
suitBtns[0] = document.getElementById('S');
suitBtns[1] = document.getElementById('H');
suitBtns[2] = document.getElementById('C');
suitBtns[3] = document.getElementById('D');
for (let i = 0; i < 4; i++) {
    suitBtns[i].addEventListener('click', () => {
        suitBtns[curSuit].style.border = '';
        curSuit = suitMap[suitBtns[i].id];
        suitBtns[curSuit].style.border = '3px solid red';
    });
}

// Add guess card when a number is selected
for (let i = 0; i < 13; i++) {
    rankBtns[i] = document.getElementById(i + 1 + '');
    rankBtns[i].addEventListener('click', () => {
        addGuessCard(i + 1);
    });
}

// Submit Guess
submitBtn.addEventListener('click', () => {
    guesses[numBoards - 1][0].classList.add(colorStatus(curGuess[0]));
    guesses[numBoards - 1][1].classList.add(colorStatus(curGuess[1]));

    if (
        guesses[numBoards - 1][0].classList.contains('green') &&
        guesses[numBoards - 1][1].classList.contains('green')
    ) {
        endGame();
    } else {
        for (let i = 0; i < 2; i++) {
            deck.splice(
                deck.findIndex(
                    (c) =>
                        c.suit === curGuess[0].suit &&
                        c.value === curGuess[0].value,
                ),
                1,
            );
        }
        createRow();
        curGuess = [];
    }
});

// Update background image of guess cards
function updateGuess() {
    if (curGuess.length >= 1) {
        guesses[numBoards - 1][0].style.backgroundImage =
            curGuess[0].toElement().style.backgroundImage;
    }
    if (curGuess.length === 2) {
        guesses[numBoards - 1][1].style.backgroundImage =
            curGuess[1].toElement().style.backgroundImage;
    }
}

// Add guess card to curGuess
function addGuessCard(i) {
    if (curGuess.length === 2) return;
    curGuess.push(allCards.find((c) => c.suit === curSuit && c.value === i));
    updateGuess();
}

// Create next board
function createRow() {
    // Create row
    const row = document.createElement('div');
    row.classList.add('row');

    // Create guess section
    const guessContainer = document.createElement('div');
    guessContainer.classList.add('guess');
    guessContainer.appendChild(new Card(-1, -1).toElement());
    guessContainer.appendChild(new Card(-1, -1).toElement());
    guesses.push([guessContainer.firstChild, guessContainer.lastChild]);
    row.appendChild(guessContainer);

    // Create Board
    const boardElement = document.createElement('div');
    boardElement.classList.add('board');
    for (let i = 0; i < 5; i++) {
        board[i] = deck.pop();
        boardElement.appendChild(board[i].toElement());
    }
    row.appendChild(boardElement);

    // Create hand rank
    const handRank = document.createElement('div');
    handRank.classList.add('hand-rank');
    handRank.textContent = handStrength();
    row.appendChild(handRank);
    screen.appendChild(row);
    document.getElementById("screen").scrollTop = document.getElementById("screen").scrollHeight;
    numBoards++;
}

// End of round
function endGame() {
    while (screen.firstChild) {
        screen.removeChild(screen.firstChild);
    }
    const winningText = document.createElement('h1');
    winningText.textContent = `Congrats! You won in ${numBoards} guesses! Please Refresh the page to play again.`;
    screen.appendChild(winningText);
}

init_game();
createRow();
