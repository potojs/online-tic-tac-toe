module.exports = class {
  constructor(socket, name) {
    this.name = name;
    this.id = socket.id;
    this.p1 = socket;
    socket.join(name);
    this.board = [...Array(3)].map(() => [...Array(3)].map(() => " "));
  }
  checkIsWinner(sym) {
    // checking for tie
    console.log(this.board)
    if(!this.board.find(row=>row.find(sym=>sym===" "))){
      console.log("hi")
      return {
        isWinner: true,
        winner: "tie",
      };
    }
    // checking vertically
    for (const row of this.board) {
      if (row.filter((tile) => tile === sym).length === 3) {
        const rowIndex = this.board.indexOf(row);
        return {
          isWinner: true,
          start: { x: 0, y: rowIndex },
          end: { x: 2, y: rowIndex },
          winner: sym,
        };
      }
    }
    // checking horizontolly
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] === this.board[1][i] &&
        this.board[2][i] === sym &&
        this.board[0][i] === sym
      ) {
        return {
          isWinner: true,
          start: { x: i, y: 0 },
          end: { x: i, y: 2 },
          winner: sym,
        };
      }
    }
    // checking diagonally
    if (
      this.board[0][0] === this.board[2][2] &&
      this.board[1][1] === sym &&
      this.board[0][0] === sym
    ) {
      return {
        isWinner: true,
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
        winner: sym,
      };
    }
    if (
      this.board[2][0] === this.board[0][2] &&
      this.board[1][1] === sym &&
      this.board[2][0] === sym
    ) {
      return {
        isWinner: true,
        start: { x: 2, y: 0 },
        end: { x: 0, y: 2 },
        winner: sym,
      };
    }

    // if not a winner
    return { isWinner: false };
  }
  checkIsDone() {
    const winnerX = this.checkIsWinner("x");
    if (winnerX.isWinner) return winnerX;
    const winnerO = this.checkIsWinner("o");
    if (winnerO.isWinner) return winnerO;

    return null;
  }
  hasPlayer(socket) {
    return this.p1 === socket || this.p2 === socket;
  }
  connectP2(socket) {
    if (this.p2) {
      socket.emit("join-room-fail", {
        err_msg: "room full already, if it's an error plz report it.",
      });
    } else {
      this.turn = this.p1;
      socket.join(this.name);
      this.p2 = socket;

      this.p1.emit("setup", {
        symbol: "x",
        turn: true,
      });
      this.p2.emit("setup", {
        symbol: "o",
        turn: false,
      });
    }
  }
};
