const socket = io();
let gameStarted = (gameFinished = false);
let symbol;
let isMyTurn;
let mouseXtile, mouseYtile;
let boardManager;
let winner, tie;
let end, start;

function setup() {
  window.canvas = createCanvas(window.innerWidth, window.innerHeight);
  boardManager = new BoardManager();
  select(".quit").mousePressed(() => {
    location.pathname = "/";
  });
}
function draw() {
  background(255);
  textAlign(CENTER, CENTER);
  if (gameStarted) {
    updateMouseTilePos();
    boardManager.showBoard();
    noStroke();
    textSize(30);
    if (gameFinished) {
      text(
        tie
          ? "it's a tie :|"
          : winner === symbol
          ? "you have won! :)"
          : "you have lost :(",
        width / 2,
        20
      );
    } else {
      text(
        isMyTurn ? "it's your turn!" : "it's your opponent's turn",
        width / 2,
        20
      );
    }
  } else {
    textSize(width < 480 ? 30 : 40);
    text("waiting for other player...", width / 2, height / 2);
  }
}
function updateMouseTilePos() {
  mouseXtile = floor((mouseX - width / 2) / boardManager.boardLineDist + 1.5);
  mouseYtile = floor((mouseY - height / 2) / boardManager.boardLineDist + 1.5);
}
function mousePressed() {
  updateMouseTilePos();
  if (!gameFinished && boardManager.mouseInBoard()) {
    if (!isMyTurn||!boardManager.setTile(mouseXtile, mouseYtile, symbol)) {
      return;
    }
    socket.emit("play", {
      x: mouseXtile,
      y: mouseYtile,
      symbol,
    });
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  boardManager.boardLineDist = min(150, windowWidth / 3 - 10);
}

// websocket events
socket.on("update", ({ board, gameHasFinished, winnerData }) => {
  console.log(board);
  isMyTurn = !isMyTurn;
  boardManager.updateBoard(board);
  if (gameHasFinished) {
    if (winnerData.winner === "tie") {
      console.log(winnerData);
      console.log("tie");
      tie = true;
      gameFinished = true;
      winner = "tie";
    } else {
      end = winnerData.end;
      start = winnerData.start;
      gameFinished = true;
      winner = winnerData.winner;
    }
    setTimeout(() => {
      document.querySelector(".quit-popup").style.display = "flex";
    }, 1500);
  }
});
socket.on("setup", (msg) => {
  if (!gameStarted) {
    symbol = msg.symbol;
    isMyTurn = msg.turn;
    gameStarted = true;
  }
});
socket.on("join-room-fail", ({ err_msg }) => {
  alert(err_msg);
  location.pathname = "/";
});
socket.on("game-ended", ({ err_msg }) => {
  alert(err_msg);
  location.pathname = "/";
});
