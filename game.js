class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }

    toString() {
        let c = "";
        switch(this.value) {
            case 1:
                c += "A of ";
                break;
            case 11:
                c += "J of ";
                break;
            case 12:
                c += "Q of ";
                break;
            case 13:
                c += "K of ";
                break;
            default:
                c += this.value + " of ";
                break;
        }

        switch(this.suit) {
            case 1:
                c += "Spades";
                break;
            case 2:
                c += "Hearts";
                break;
            case 3:
                c += "Clubs";
                break;
            case 4:
                c += "Diamonds";
                break;
        }

        return c;
    }
}

let deck = [];
let hand = [null, null];
let board = [null, null, null, null, null];
let gameOver = false;

function init_game() {
    deck = [];
    for (let i = 1; i <= 4; ++i) {
        for (let j = 1; j <= 13; ++j) {
            deck.push(new Card(j, i));
        }
    }

    deck.sort(() => Math.random() - 0.5);
    hand[0] = deck.pop();
    hand[1] = deck.pop();
}

function newGuess() {
    for (let i = 0; i < 5; ++i) {
        board[i] = deck.pop();
    }

    console.log("Board:");
    for (let i = 0; i < 5; ++i) {
        console.log(board[i].toString());
    }

    console.log("You have a " + handStrength());
}

function createBoard() {

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
    if (histo[0] !== 0 && histo[9] !== 0 && histo[10] !== 0 && histo[11] !== 0 && histo[12] !== 0) {
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

        if (histo[0] !== 0 && histo[9] !== 0 && histo[10] !== 0 && histo[11] !== 0 && histo[12] !== 0) {
            strength = 9;
        }

    }

    switch (strength) {
        case 1:
            return "Pair";
        case 2:
            return "Two Pair";
        case 3:
            return "Three of a Kind";
        case 4:
            return "Straight";
        case 5:
            return "Flush";
        case 6:
            return "Full House";
        case 7:
            return "Four of a Kind";
        case 8:
            return "Straight Flush";
        case 9:
            return "Royal Flush";
        default:
            return "High Card";
    }
}
function evalGuess(guess) {
    let s = "";
    let c1 = new Card(guess[0][0], guess[0][1]);
    let c2 = new Card(guess[1][0], guess[1][1]);

    s += c1 + ": " + colorStatus(c1) + "\n";
    s += c2 + ": " + colorStatus(c2);

    if (colorStatus(c1) === "Green" && colorStatus(c2) === "Green") gameOver = true;

    return s;
}

function colorStatus(c) {
    let value = c.value;
    let suit = c.suit;
    let cards = [hand[0].value, hand[1].value];
    let suits = [hand[0].suit, hand[1].suit];
    if ((value === cards[0] && suit === suits[0]) || (value === cards[1] && suit === suits[1])) return "Green";
    if (value === cards[0] || value === cards[1] || suit === suits[0] || suit === suits[1]) return "Yellow";
    return "Gray";
}

function main() {

    init_game();
    while(!gameOver) {
        newGuess();
        let guess = new Array(2).map(() => new Array(2));
        // const input = prompt("Enter Guess (Card: 1-13, Suit: 1 - 4 [Spades, Hearts, Clubs, Diamonds])");
        // const nums = input.split(" ");
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                // guess[i][j] = nums[i+j];
            }
        }
        console.log(evalGuess(guess));
    }

    console.log("Correct!");
}

// main();
