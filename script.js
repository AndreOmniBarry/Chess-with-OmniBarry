const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

const initialBoard = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let gameState = JSON.parse(JSON.stringify(initialBoard));
let selectedSquare = null;
let turn = "w"; // w = white, b = black

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
      square.dataset.row = row;
      square.dataset.col = col;
      square.textContent = gameState[row][col];
      if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        square.classList.add("selected");
      }
      square.addEventListener("click", () => handleSquareClick(row, col));
      boardEl.appendChild(square);
    }
  }
}

function handleSquareClick(row, col) {
  const piece = gameState[row][col];
  if (selectedSquare) {
    if (isLegalMove(selectedSquare.row, selectedSquare.col, row, col)) {
      gameState[row][col] = gameState[selectedSquare.row][selectedSquare.col];
      gameState[selectedSquare.row][selectedSquare.col] = "";
      turn = turn === "w" ? "b" : "w";
      statusEl.textContent = turn === "w" ? "White to move" : "Black to move";
    }
    selectedSquare = null;
  } else {
    if (piece && pieceBelongsToCurrentPlayer(piece)) {
      selectedSquare = { row, col };
    }
  }
  renderBoard();
}

function pieceBelongsToCurrentPlayer(piece) {
  return (turn === "w" && piece === piece.toUpperCase()) ||
         (turn === "b" && piece === piece.toLowerCase());
}

function isLegalMove(fromRow, fromCol, toRow, toCol) {
  const piece = gameState[fromRow][fromCol];
  const target = gameState[toRow][toCol];
  if (piece === "" || (target && pieceBelongsToCurrentPlayer(target))) return false;

  const dr = toRow - fromRow;
  const dc = toCol - fromCol;

  switch (piece.toLowerCase()) {
    case "♙": // Pawn (white)
      if (turn === "w") {
        if (dc === 0 && target === "" && (dr === -1 || (fromRow === 6 && dr === -2 && gameState[5][fromCol] === ""))) return true;
        if (Math.abs(dc) === 1 && dr === -1 && target && !pieceBelongsToCurrentPlayer(target)) return true;
      } else {
        if (dc === 0 && target === "" && (dr === 1 || (fromRow === 1 && dr === 2 && gameState[2][fromCol] === ""))) return true;
        if (Math.abs(dc) === 1 && dr === 1 && target && !pieceBelongsToCurrentPlayer(target)) return true;
      }
      return false;

    case "♖": // Rook
      if (dr !== 0 && dc !== 0) return false;
      return isPathClear(fromRow, fromCol, toRow, toCol);

    case "♘": // Knight
      return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);

    case "♗": // Bishop
      if (Math.abs(dr) !== Math.abs(dc)) return false;
      return isPathClear(fromRow, fromCol, toRow, toCol);

    case "♕": // Queen
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        return isPathClear(fromRow, fromCol, toRow, toCol);
      }
      return false;

    case "♔": // King
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;

    default:
      return false;
  }
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
  const dr = Math.sign(toRow - fromRow);
  const dc = Math.sign(toCol - fromCol);
  let r = fromRow + dr;
  let c = fromCol + dc;
  while (r !== toRow || c !== toCol) {
    if (gameState[r][c] !== "") return false;
    r += dr;
    c += dc;
  }
  return true;
}

renderBoard();
