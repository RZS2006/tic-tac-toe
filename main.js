// --- Selectors ---

const settingsContainer = document.querySelector("#settings-container");

const board = document.querySelector("#board");
const boardCells = document.querySelectorAll("[data-cell]");

const startGameBtn = document.querySelector("#start-game-btn");
const backBtn = document.querySelector("#back-btn");

const gameModeSelect = document.querySelector("#game-mode");
const startingPlayerSelect = document.querySelector("#starting-player");

const player1Container = document.querySelector("#player-1-container");
const player2Container = document.querySelector("#player-2-container");
const player1NameElement = document.querySelector("#player-1-name-element");
const player2NameElement = document.querySelector("#player-2-name-element");
const player1ScoreElement = document.querySelector("#player-1-score-element");
const player2ScoreElement = document.querySelector("#player-2-score-element");
const resultElement = document.querySelector("#result-element");

// --- Variables ---

let userPlayer;
let opponentPlayer;

let currentPlayer;

let player1Score = 0;
let player2Score = 0;

let cellArray;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
]


// --- Main Functions ---

const handleClick = (event) => {
    removeAllEvents() // Remove All Event Listeners

    let clickedCell = event.target

    markPosition(clickedCell.id, currentPlayer)
    if (checkStatus(currentPlayer)) {
        gameEnded(checkStatus(currentPlayer))
        return;
    } 
    switchTurn()
    

    if (gameModeSelect.value === "two-players") {
        addAvailableEvents()
    }

    if (gameModeSelect.value === "beginner-ai") {
        randomPosition() 
    }

    // if (gameModeSelect.value === "expert-ai") {
    //     bestPosition()
    // }
}

const markPosition = (index, player) => {
    const selectedCell = document.getElementById(index)
    selectedCell.innerText = player;
    cellArray[index] = player;
    selectedCell.removeEventListener("click", handleClick)
}

const randomPosition = () => {
    let randomNumber = Math.floor(Math.random() * availableCells().length)
    let index = availableCells()[randomNumber]
    setTimeout(() => {
        markPosition(index, opponentPlayer)
        if (checkStatus(currentPlayer)) {
            gameEnded(checkStatus(currentPlayer))
            return;
        }
        switchTurn()
        addAvailableEvents()
    }, 1000)
}

// const bestPosition = () => {
//     let cellArrayCopy = [...cellArray]

//     let bestScore = -Infinity
//     let bestMove;

//     availableCells().forEach(index => {
//         cellArrayCopy[index] = currentPlayer
//     })
//     let score = minimax(cellArray, false)
//     if (score > bestScore) {
//         bestScore = score;
//         bestMove = index;
//     }

//     setTimeout(() => {
//         markPosition(bestMove, opponentPlayer)
//         if (checkStatus(currentPlayer)) {
//             gameEnded(checkStatus(currentPlayer))
//             return;
//         }
//         switchTurn()
//         addAvailableEvents()
//     }, 1000)
// }

// let scores = {
//     opponentPlayer: 10,
//     userPlayer: -10,
//     drae: 0 
// }

// const minimax = (board, isMaxminzing) => {
//     let result = checkStatus();
//     if (result) {
//         let score = scores[result]
//         return score
//     }

//     if (isMaxminzing) {
//         let bestScore = -Infinity
//         availableCells().forEach(index => {
//             cellArrayCopy[index] = currentPlayer;
//             let score = minimax(board, true);
//             if (score > bestScore) {
//                 bestScore = score;
//                 bestMove = index;
//             }
//         })
//         return bestScore
//     } else {
//         let bestScore = Infinity
//         availableCells().forEach(index => {
//             cellArrayCopy[index] = currentPlayer;
//             let score = minimax(board, false);
//             if (score < bestScore) {
//                 bestScore = score;
//                 bestMove = index;
//             }
//         })
//         return bestScore
//     }
// }

const checkStatus = (player) => {
    let status = null;
    winningCombos.forEach(combo => {
        let c1 = combo[0];
        let c2 = combo[1];
        let c3 = combo[2];
        if (cellArray[c1] === cellArray[c2] && cellArray[c1] === cellArray[c3] && cellArray[c1] === player) {
            console.log("win");
            removeAllEvents()
            combo.forEach(index => boardCells[index].classList.add("winner"))
            status = player;
        }
    })
    if (status === null && availableCells().length === 0) { 
        console.log("draw");
        removeAllEvents()
        status = "draw";
    }
    return status
}

const switchTurn = () => {
    if (currentPlayer === userPlayer) {
        currentPlayer = opponentPlayer;
        showTurn(opponentPlayer)
    } else {
        currentPlayer = userPlayer;
        showTurn(userPlayer)
    }
}

const gameEnded = (status) => {
    if (status === "draw") {
        setResult("Draw")
    } else if (status === "X") {
        player1Score++
        setPlayerScores(player1Score, player2Score)
        setResult("Player X Wins")
    } else if (status === "O") {
        player2Score++
        setPlayerScores(player1Score, player2Score)
        setResult("Player O Wins")
    }
    setTimeout(() => {
        switchTurn()
        startGame(currentPlayer)
    }, 2000)
}

const showTurn = (player) => {
    if (player === "X") {
        player2Container.classList.remove("active")
        player1Container.classList.add("active")
    } else {
        player1Container.classList.remove("active")
        player2Container.classList.add("active")
    }
}

const startGame = (startingPlayer) => {
    currentPlayer = startingPlayer;
    cellArray = [...Array(9).keys()]
    setResult("");

    boardCells.forEach(cell => {
        cell.classList.remove("winner")
        cell.innerText = "";
    })
        addAllEvents()
        showTurn(currentPlayer)

        if (gameModeSelect.value === "beginner-ai" && currentPlayer === opponentPlayer) {
            randomPosition()
        }

        // if (gameModeSelect.value === "expert-ai" && currentPlayer === opponentPlayer) {
        //     bestPosition()
        // }
}

const setupGame = (gameMode, startingPlayer) => {

    player1Score = 0;
    player2Score = 0;
    setPlayerScores()

    if (gameMode === "two-players") {
        userPlayer = "X";
        opponentPlayer = "O";
        setPlayerNames("Player 1", "Player 2")
        startGame(userPlayer)
    } 
    else if (startingPlayer === "player-X") {
        userPlayer = "X";
        opponentPlayer = "O";
        setPlayerNames("User", "Opponent")
        startGame(userPlayer)
    } 
    else if (startingPlayer === "player-O") {
        userPlayer = "O";
        opponentPlayer = "X";
        setPlayerNames("Opponent", "User")
        startGame(opponentPlayer)
    }
}

// --- Helper Functions ---

const addAllEvents = () => {
    boardCells.forEach(cell => {
        cell.addEventListener("click", handleClick)
    })
}

const removeAllEvents = () => {
    boardCells.forEach(cell => {
        cell.removeEventListener("click", handleClick);
    })
}

const addAvailableEvents = () => {
    availableCells().forEach(index => {
        boardCells[index].addEventListener("click", handleClick);
    })
}

const availableCells = () => {
    return cellArray.filter(value => typeof value === "number");
}

const setPlayerScores = () => {
    player1ScoreElement.innerText = player1Score;
    player2ScoreElement.innerText = player2Score;
}

const setPlayerNames = (player1Name, player2Name) => {
    player1NameElement.innerText = player1Name;
    player2NameElement.innerText = player2Name;
}

const setResult = (resultText) => {
    resultElement.innerText = resultText;
}



// --- Event Listeners ---

startGameBtn.addEventListener("click", () => {
    settingsContainer.classList.add("hidden");
    setupGame(gameModeSelect.value, startingPlayerSelect.value);
})

backBtn.addEventListener("click", () => {
    settingsContainer.classList.remove("hidden");
})

gameModeSelect.addEventListener("change", () => {
    if (gameModeSelect.value === "two-players") {
        startingPlayerSelect.classList.add("hidden");
    } else {
        startingPlayerSelect.classList.remove("hidden");
    }
})