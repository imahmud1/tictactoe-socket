var currentPlayer = "X";
var timer; // Timer variable
var timerDuration = 4000; // Timer duration in milliseconds
var board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
var socket = io();

function makeMove(row, col) {
  if (board[row][col] === "") {
    clearTimeout(timer); // Clear any existing timer

    board[row][col] = currentPlayer;
    var cell = document.getElementById("board").children[row].children[col];
    cell.textContent = currentPlayer;

    // Remove the class for the other player, if present
    cell.classList.remove("player-x", "player-o");

    // Add the class for the current player
    cell.classList.add("player-" + currentPlayer.toLowerCase());

    socket.emit("playerMove", { row, col });
    if (checkWin()) {
      clearTimeout(timer); // Clear the timer
      alert(currentPlayer + " wins!");
      resetGame();
      return; // Exit the function after game ends
    } else if (checkTie()) {
      clearTimeout(timer); // Clear the timer
      alert("It's a tie!");
      resetGame();
      return; // Exit the function after game ends
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("turn-indicator").textContent = "Current Turn: " + currentPlayer;
      startTimer();
  }
}

// Event handler for receiving opponent moves
socket.on("opponentMove", (data) => {
  clearTimeout(timer); // Clear any existing timer

  var row = data.row;
  var col = data.col;
  board[row][col] = currentPlayer;
  document.getElementById("board").children[row].children[col].textContent = currentPlayer;
  document.getElementById("board").children[row].children[col].classList.remove("selected");
  document.getElementById("board").children[row].children[col].classList.add("player-" + currentPlayer.toLowerCase());
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (checkWin()) {
    alert(currentPlayer + " wins!");
    resetGame();
    return; // Exit the function after game ends
  } else if (checkTie()) {
    alert("It's a tie!");
    resetGame();
    return; // Exit the function after game ends
  }

  document.getElementById("turn-indicator").textContent = "Current Turn: " + currentPlayer;
    startTimer();
});

// Function to start the timer
function startTimer() {
  var timeRemaining = timerDuration / 1000; // Convert to seconds
  updateTimerDisplay(timeRemaining);

  timer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timer);
      selectRandomCell();
    }
  }, 1000);
}

function resetTimer() {
  clearTimeout(timer);
  startTimer();
}

function updateTimerDisplay(timeRemaining) {
  var timerElement = document.getElementById("timer");
  timerElement.textContent = "Time Remaining: " + Math.max(timeRemaining, 0) + "s";
}

function selectRandomCell() {
  var emptyCells = [];
  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    var randomIndex = Math.floor(Math.random() * emptyCells.length);
    var randomCell = emptyCells[randomIndex];
    makeMove(randomCell.row, randomCell.col);
  }
}

function checkWin() {
  // Check rows
  for (var i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return true;
    }
  }

  // Check columns
  for (var j = 0; j < 3; j++) {
    if (
      board[0][j] !== "" &&
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j]
    ) {
      return true;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return true;
  }
  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return true;
  }

  return false;
}

function checkTie() {
  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  resetBoard(); // Reset the game board
  clearInterval(timer); // Clear the timer
}

function resetBoard() {
  currentPlayer = "X";
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = "";
    cells[i].classList.remove("player-x", "player-o", "selected");
  }
  document.getElementById("turn-indicator").textContent = "Current Turn: " + currentPlayer;
  document.getElementById("timer").textContent = "Time Remaining: " + (timerDuration / 1000) + "s";
}

// Reset the game board initially
resetBoard();
