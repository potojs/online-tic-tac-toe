const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Game = require("./game");
require("dotenv").config();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("main");
});

app.get("/game/:id", (req, res) => {
  res.render("game", {
    room: req.params.id,
  });
});
let playerSearching = null;
app.get("/searching", (req, res)=>{
  res.render("searching");
})
const games = [];

io.on("connection", (socket) => {
  console.log("connection");
  const pathSpliced = socket.handshake.headers.referer.split("/");
  if(pathSpliced[pathSpliced.length-2] !== "game"){
    console.log("player searching");
    if(playerSearching === null){
      playerSearching = socket;
    }else{
      const room = genRand(12);
      socket.emit("redirect", room);
      playerSearching.emit("redirect", room);
      playerSearching = null;
    }
  }else{
    console.log("player joining a room");
    const room = pathSpliced[pathSpliced.length - 1];

    let gameFound = false;
    for (const game of games) {
      if (game.name === room) {
        game.connectP2(socket);
        gameFound = true;
        console.log("player 2 joined game: "+game.name)
        break;
      }
    }
    if (!gameFound) {
      console.log("game created, player 1 waiting")
      games.push(new Game(socket, room));
    }
  }
  socket.on("play", msg=>{
    const game = games.find(game=>game.hasPlayer(socket));
    if(game) {
      if(game.turn === socket && game.board[msg.y][msg.x] === " ") {
        if(socket===game.p1){
          game.board[msg.y][msg.x] = "x";
          game.turn = game.p2;
        }else if(socket===game.p2){
          game.board[msg.y][msg.x] = "o";
          game.turn = game.p1;
        }
        const winnerData = game.checkIsDone();
        io.to(game.name).emit("update", {
          board: game.board,
          gameHasFinished: !!winnerData,
          winnerData,
        })
      }
    }
  })
  socket.on("cancel-searching", ()=>{
    console.log("player canceled searching")
    if(socket.id === playerSearching.id) {
      playerSearching = null;
    }
  })
  socket.on("disconnect", () => {
    console.log("player disconnected");
    for (const game of games) {
      if (game.p1 === socket || game.p2 === socket) {
        endGame(game, socket);
      }
    }
    if(socket === playerSearching) {
      playerSearching = null;
    }
  });
});
function genRand(n){
  let result = "";
  for(let i=0;i<n;i++){
    result += String.fromCharCode(65 + Math.floor(Math.random()*26) + (32*Math.round(Math.random())));
  }
  return result;
}
function endGame(game, socket) {
  games.splice(games.indexOf(game), 1);
  if (game.p1 === socket && game.p2) {
    game.p2.emit("game-ended", {
      err_msg: "player 1 disconnected",
    });
  } else if (game.p2 === socket && game.p1) {
    game.p1.emit("game-ended", {
      err_msg: "player 2 disconnected",
    });
  }
}

const port = 4000 || process.env.PORT;
http.listen(port, () => console.log("listenning on port: " + port));
