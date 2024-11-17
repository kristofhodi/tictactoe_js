document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.querySelector(".board");
    const messageElement = document.querySelector(".message");
    const newGameButton = document.querySelector(".new-game");
    const twoPlayerButton = document.getElementById("twoPlayer");
    const vsComputerButton = document.getElementById("vsComputer");

    let board = Array(9).fill(null);
    let currentPlayer = "X";
    let gameOver = false;
    let vsComputer = false;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function initializeGame() {
        board = Array(9).fill(null);
        currentPlayer = "X";
        gameOver = false;
        boardElement.innerHTML = "";
        messageElement.textContent = "";
        newGameButton.style.display = "none";

        board.forEach((_, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = index;
            cell.addEventListener("click", handleCellClick);
            boardElement.appendChild(cell);
        });
    }

    function handleCellClick(event) {
        if (gameOver) return;

        const index = event.target.dataset.index;
        if (board[index] !== null) return;

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("taken");

        if (checkWinner(currentPlayer)) {
            messageElement.textContent = `${currentPlayer} játékos nyert!`;
            gameOver = true;
            newGameButton.style.display = "inline-block";
        } else if (board.every(cell => cell !== null)) {
            messageElement.textContent = "A játék döntetlen!";
            gameOver = true;
            newGameButton.style.display = "inline-block";
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            if (vsComputer && currentPlayer === "O" && !gameOver) {
                computerMove();
            }
        }
    }

    function checkWinner(player) {
        return winningCombinations.some(combination =>
            combination.every(index => board[index] === player)
        );
    }

    function computerMove() {
        let bestMove = null;

        winningCombinations.some(combination => {
            const playerCells = combination.filter(index => board[index] === "O");
            const emptyCells = combination.filter(index => board[index] === null);

            if (playerCells.length === 2 && emptyCells.length === 1) {
                bestMove = emptyCells[0];
                return true; 
            }
        });

        if (bestMove === null) {
            winningCombinations.some(combination => {
                const opponentCells = combination.filter(index => board[index] === "X");
                const emptyCells = combination.filter(index => board[index] === null);

                if (opponentCells.length === 2 && emptyCells.length === 1) {
                    bestMove = emptyCells[0];
                    return true; 
                }
            });
        }

        if (bestMove === null) {
            const availableMoves = board
                .map((cell, index) => (cell === null ? index : null))
                .filter(index => index !== null);
            bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
        cell.click(); 
    }

    newGameButton.addEventListener("click", initializeGame);
    twoPlayerButton.addEventListener("click", () => {
        vsComputer = false;
        initializeGame();
    });
    vsComputerButton.addEventListener("click", () => {
        vsComputer = true;
        initializeGame();
    });

    initializeGame();
});
