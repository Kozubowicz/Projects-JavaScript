"use strict";

export class Game {
  static defaultInitialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static GameStatus = {
    playing: "playing",
    win: "win",
    lose: "lose",
  };

  constructor(
    board,
    score = 0,
    best = 0,
    status = Game.GameStatus.playing,
    initialState = Game.defaultInitialState
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = board ? board : initialState.map((row) => [...row]);
    this.score = score;
    this.best = best;
    this.status = status;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getBestScore() {
    return this.best;
  }

  getStatus() {
    return this.status;
  }

  static loadFromStorage() {
    const data = localStorage.getItem("gameData");

    if (data) {
      const { board, score, best, status } = JSON.parse(data);

      return new Game(board, score, best, status);
    } else {
      return new Game();
    }
  }

  saveToStorage() {
    const data = JSON.stringify({
      board: this.board,
      score: this.score,
      best: this.best,
      status: this.status,
    });
    localStorage.setItem("gameData", data);
  }

  start() {
    if (this.board.every((row) => row.every((cell) => cell === 0))) {
      this.status = Game.GameStatus.playing;
      this.newCell();
      this.newCell();
      this.saveToStorage();
    }
  }

  restart() {
    this.score = 0;

    this.board = this.initialState.map((row) => [...row]);
    this.start();
  }

  newCell() {
    const emptyCells = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!this.board[y][x]) {
          emptyCells.push({ y: y, x: x });
        }
      }
    }

    if (emptyCells.length > 0) {
      const val = Math.floor(Math.random() * emptyCells.length);

      this.board[emptyCells[val].y][emptyCells[val].x] =
        Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameState() {
    if (this.board.find((row) => row.find((el) => el === 2048))) {
      this.status = Game.GameStatus.win;
    } else if (this.checkIfLose()) {
      this.status = Game.GameStatus.lose;
    }
  }

  checkIfLose() {
    if (this.board.find((row) => row.includes(0))) {
      return false;
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (y < 3 && this.board[y][x] === this.board[y + 1][x]) {
          return false;
        }

        if (x < 3 && this.board[y][x] === this.board[y][x + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    if (this.status === Game.GameStatus.lose) {
      return false;
    }

    const rows = document.querySelectorAll("tr");
    let hasChanged = false;
    const merged = Array.from({ length: 4 }, () => [
      false,
      false,
      false,
      false,
    ]);

    // Helper function for moving and merging cells without reusing 'direction'
    const moveCell = (startY, startX, deltaY, deltaX, cssClass) => {
      if (this.board[startY][startX] !== 0) {
        let newY = startY;
        let newX = startX;
        let moveDistance = 0;

        // Move the cell as far as possible
        while (
          newY + deltaY >= 0 &&
          newY + deltaY < 4 &&
          newX + deltaX >= 0 &&
          newX + deltaX < 4 &&
          this.board[newY + deltaY][newX + deltaX] === 0
        ) {
          newY += deltaY;
          newX += deltaX;
          moveDistance++;
        }

        const cellElement = rows[startY].cells[startX].firstChild;

        // Check if a merge is possible
        if (
          newY + deltaY >= 0 &&
          newY + deltaY < 4 &&
          newX + deltaX >= 0 &&
          newX + deltaX < 4 &&
          this.board[newY + deltaY][newX + deltaX] ===
            this.board[startY][startX] &&
          !merged[newY + deltaY][newX + deltaX]
        ) {
          // Merge cells
          this.board[newY + deltaY][newX + deltaX] *= 2;
          this.score += this.board[newY + deltaY][newX + deltaX];

          if (this.score > this.best) {
            this.best = this.score;
          }

          this.board[startY][startX] = 0;
          merged[newY + deltaY][newX + deltaX] = true;
          hasChanged = true;

          // Apply animation for merging
          if (cellElement) {
            cellElement.classList.add(`${cssClass}--${moveDistance + 1}`);
          }
        } else if (newY !== startY || newX !== startX) {
          // Move without merging
          this.board[newY][newX] = this.board[startY][startX];
          this.board[startY][startX] = 0;
          hasChanged = true;

          //Apply animation for movement
          if (cellElement) {
            cellElement.classList.add(`${cssClass}--${moveDistance}`);
          }
        }
      }
    };

    // Logic for moving in the correct direction
    if (direction === "up") {
      for (let x = 0; x < 4; x++) {
        for (let y = 1; y < 4; y++) {
          moveCell(y, x, -1, 0, "move-up");
        }
      }
    } else if (direction === "down") {
      for (let x = 0; x < 4; x++) {
        for (let y = 2; y >= 0; y--) {
          moveCell(y, x, 1, 0, "move-down");
        }
      }
    } else if (direction === "left") {
      for (let y = 0; y < 4; y++) {
        for (let x = 1; x < 4; x++) {
          moveCell(y, x, 0, -1, "move-left");
        }
      }
    } else if (direction === "right") {
      for (let y = 0; y < 4; y++) {
        for (let x = 2; x >= 0; x--) {
          moveCell(y, x, 0, 1, "move-right");
        }
      }
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
      this.saveToStorage();
    }

    return hasChanged;
  }

  moveUp() {
    return this.move("up");
  }

  moveDown() {
    return this.move("down");
  }

  moveLeft() {
    return this.move("left");
  }

  moveRight() {
    return this.move("right");
  }
}
