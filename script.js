const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const toggleAIButton = document.getElementById('toggleAIButton');

const playerXScoreDisplay = document.getElementById('playerXScore');
const playerOScoreDisplay = document.getElementById('playerOScore');
const drawsScoreDisplay = document.getElementById('drawsScore');
const resultMessage = document.getElementById('resultMessage'); // New element to display result

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isAIActive = false;  // Toggle AI mode
let playerXScore = 0;
let playerOScore = 0;
let drawsScore = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }

    updateBoard(cell, cellIndex);
    if (checkForWinner()) return;

    if (isAIActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500);  // Delay AI move for better UX
    }
}

// Update the board
function updateBoard(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check for winner or draw
function checkForWinner() {
    let roundWon = false;
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            highlightWinningCells([a, b, c]);
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        displayResult(currentPlayer === 'X' ? 'O' : 'X'); // Previous player won
        updateScore(currentPlayer === 'X' ? 'O' : 'X');
        return true;
    }

    if (!board.includes('')) {
        isGameActive = false;
        displayResult('draw');
        updateScore('draw');
        return true;
    }

    return false;
}

// Highlight winning cells
function highlightWinningCells(cellsToHighlight) {
    cellsToHighlight.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

// AI makes a random move
function aiMove() {
    let availableMoves = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);
    
    if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        updateBoard(cells[randomMove], randomMove);
        checkForWinner();
    }
}

// Display the result in the resultMessage div
function displayResult(winner) {
    if (winner === 'X') {
        resultMessage.textContent = 'Player X wins!';
    } else if (winner === 'O') {
        resultMessage.textContent = 'Player O wins!';
    } else {
        resultMessage.textContent = 'It\'s a draw!';
    }
}

// Update score and UI
function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
        playerXScoreDisplay.textContent = playerXScore;
    } else if (winner === 'O') {
        playerOScore++;
        playerOScoreDisplay.textContent = playerOScore;
    } else {
        drawsScore++;
        drawsScoreDisplay.textContent = drawsScore;
    }
}

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    resultMessage.textContent = ''; // Clear the result message
    currentPlayer = 'X';
    isGameActive = true;
}

// Toggle between AI and two-player mode
toggleAIButton.addEventListener('click', () => {
    isAIActive = !isAIActive;
    toggleAIButton.textContent = isAIActive ? 'Play with Human' : 'Play with AI';
    resetGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
