class BoardManager {
  constructor() {
    this.boardLineDist = min(150, width / 3 - 10);
    this.board = [...Array(3)].map(() => [...Array(3)].map(() => " "));
  }
  updateBoard(newBoard) {
    this.board = newBoard;
  }
  setTile(x, y, symbol) {
    if (this.board[y][x] === " ") {
      this.board[y][x] = symbol;
      return true;
    }
    return false;
  }
  showBoard() {
    this.drawSymbols();
    this.drawBoardLines();
  }
  drawSymbols() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.drawSymbol(
          width / 2 + (j - 1) * this.boardLineDist,
          height / 2 + (i - 1) * this.boardLineDist,
          this.board[i][j]
        );
      }
    }

    if (!gameFinished) {
      if (this.mouseInBoard() && this.board[mouseYtile][mouseXtile] === " ") {
        this.drawSymbol(
          width / 2 + (mouseXtile - 1) * this.boardLineDist,
          height / 2 + (mouseYtile - 1) * this.boardLineDist,
          symbol,
          isMyTurn?170:40
        );
      }
    }
  }
  mouseInBoard() {
    return (
      mouseXtile < 3 && mouseXtile >= 0 && mouseYtile < 3 && mouseYtile >= 0
    );
  }
  drawSymbol(x, y, symbol, alpha=255) {
    const scaling = 30;
    if (symbol === "o") {
      stroke(0, 0, 255, alpha);
      strokeWeight(6);
      ellipse(x, y, this.boardLineDist - scaling);
    } else if (symbol === "x") {
      stroke(255, 0, 0, alpha);
      strokeWeight(5);
      line(
        x - this.boardLineDist / 2 + scaling / 2,
        y - this.boardLineDist / 2 + scaling / 2,
        x + this.boardLineDist / 2 - scaling / 2,
        y + this.boardLineDist / 2 - scaling / 2
      );
      line(
        x + this.boardLineDist / 2 - scaling / 2,
        y - this.boardLineDist / 2 + scaling / 2,
        x - this.boardLineDist / 2 + scaling / 2,
        y + this.boardLineDist / 2 - scaling / 2
      );
    }
  }
  drawBoardLines() {
    stroke(0);
    strokeWeight(5);
    for (let i = 0; i < 2; i++) {
      const xPos = width / 2 - this.boardLineDist / 2 + i * this.boardLineDist;
      line(
        xPos,
        height / 2 - this.boardLineDist * 1.5,
        xPos,
        height / 2 + this.boardLineDist * 1.5
      );
    }
    for (let i = 0; i < 2; i++) {
      const yPos = height / 2 - this.boardLineDist / 2 + i * this.boardLineDist;
      line(
        width / 2 - this.boardLineDist * 1.5,
        yPos,
        width / 2 + this.boardLineDist * 1.5,
        yPos
      );
    }
    if(gameFinished && end) {
      console.log("hah")
      stroke(80);
      strokeWeight(8);
      line(
        width/2 + this.boardLineDist * (start.x - 1),
        height/2 + this.boardLineDist * (start.y - 1),
        width/2 + this.boardLineDist * (end.x - 1),
        height/2 + this.boardLineDist * (end.y - 1),
      )
    }
  }
}
