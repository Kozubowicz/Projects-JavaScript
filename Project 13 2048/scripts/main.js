"use strict";

import { Game } from "../modules/Game.class.js";

const button = document.querySelector(".button");
const score = document.querySelector(".game-score");

const best = document.querySelector(".game-score--best");

const rows = document.querySelectorAll("tr");

const messageStart = document.querySelector(".message-start");
const messageLose = document.querySelector(".message-lose");
const messageWin = document.querySelector(".message-win");

button.addEventListener("click", () => {
  game.restart();

  drawBoard();

  updateMessage();
});

document.addEventListener("keydown", (eventKey) => {
  let canMove = false;

  switch (eventKey.key) {
    case "ArrowUp":
      canMove = game.moveUp();
      break;
    case "ArrowDown":
      canMove = game.moveDown();
      break;
    case "ArrowLeft":
      canMove = game.moveLeft();
      break;
    case "ArrowRight":
      canMove = game.moveRight();
      break;
  }

  if (canMove) {
    setTimeout(() => {
      drawBoard();
      updateMessage();
    }, 300);
  }
});

function drawBoard() {
  score.textContent = game.getScore();
  best.textContent = game.getBestScore();

  const board = game.getState();

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = rows[y].cells[x];

      if (board[y][x] === 0) {
        if (cell.firstChild) {
          cell.removeChild(cell.firstChild);
        }
      } else {
        if (!cell.firstChild || cell.firstChild.textContent !== board[y][x]) {
          cell.innerHTML = "";

          const div = document.createElement("div");

          div.className = `field-cell-num field-cell--${board[y][x]}`;
          div.textContent = board[y][x];

          cell.appendChild(div);
        }
      }
    }
  }
}

function updateMessage() {
  const gameStatus = game.getStatus();

  if (gameStatus === Game.GameStatus.win) {
    messageWin.classList.remove("hidden");
  } else if (gameStatus === Game.GameStatus.lose) {
    messageLose.classList.remove("hidden");
  } else {
    messageWin.classList.add("hidden");
    messageLose.classList.add("hidden");
  }
}

const game = Game.loadFromStorage();
game.start();
drawBoard();
updateMessage();
