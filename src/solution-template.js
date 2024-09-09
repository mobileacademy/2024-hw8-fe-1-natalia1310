const boardElement = document.getElementById("board");
const startButton = document.getElementById("startButton");
const difficultySelect = document.getElementById("difficulty");
const bombProbabilityInput = document.getElementById("bombProbability");
const maxProbabilityInput = document.getElementById("maxProbability");

let board = [];
let bombProbability = 3;
let maxProbability = 15;

// Event listener for the Start Game button
startButton.addEventListener("click", () => {
    bombProbability = parseInt(bombProbabilityInput.value);
    maxProbability = parseInt(maxProbabilityInput.value);

    const difficulty = difficultySelect.value;
    let rows, cols;

    if (difficulty === "easy") {
        rows = cols = 9;
    } else if (difficulty === "medium") {
        rows = cols = 16;
    } else if (difficulty === "hard") {
        rows = 16;
        cols = 30;
    }

    generateBoard(rows, cols);
});

function generateBoard(rows, cols) {
    board = [];
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            const hasBomb = Math.random() * maxProbability < bombProbability;
            const square = new BoardSquare(hasBomb, 0);
            board[i][j] = square;

            const squareElement = document.createElement("div");
            squareElement.classList.add("square");
            squareElement.addEventListener("click", () => onClickSquare(i, j));
            boardElement.appendChild(squareElement);
        }
    }

    // Count bombs around each square
    countBombsAround();
}

function onClickSquare(row, col) {
    const square = board[row][col];
    const squareElement = boardElement.children[row * board[0].length + col];

    if (square.hasBomb) {
        squareElement.classList.add("bomb");
        alert("Game Over!");
        restartGame();  // Restart the game after Game Over
    } else {
        squareElement.classList.add("safe");
        squareElement.textContent = square.bombsAround;
        checkWinCondition();
    }
}

function countBombsAround() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = getSurroundingBombs(i, j);
            }
        }
    }
}

function getSurroundingBombs(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (
                newRow >= 0 &&
                newRow < board.length &&
                newCol >= 0 &&
                newCol < board[0].length &&
                board[newRow][newCol].hasBomb
            ) {
                count++;
            }
        }
    }
    return count;
}

function checkWinCondition() {
    let safeSquares = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const squareElement = boardElement.children[i * board[0].length + j];
            if (!board[i][j].hasBomb && squareElement.classList.contains("safe")) {
                safeSquares++;
            }
        }
    }

    if (safeSquares === board.length * board[0].length - countTotalBombs()) {
        alert("Congratulations! You've won!");
        restartGame();  // Restart the game after winning
    }
}

function countTotalBombs() {
    let bombCount = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].hasBomb) {
                bombCount++;
            }
        }
    }
    return bombCount;
}

// Function to restart the game
function restartGame() {
    const difficulty = difficultySelect.value;
    let rows, cols;

    if (difficulty === "easy") {
        rows = cols = 9;
    } else if (difficulty === "medium") {
        rows = cols = 16;
    } else if (difficulty === "hard") {
        rows = 16;
        cols = 30;
    }

    generateBoard(rows, cols);
}

// BoardSquare class to store square properties
class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}
