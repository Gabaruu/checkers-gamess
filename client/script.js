const socket = io("https://your-render-url.onrender.com"); // Replace with your backend URL

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 75;
const ROWS = 8;
const COLS = 8;

let board = [];
let currentPlayer = 1; // 1 = red, 2 = black
let selected = null;
let isOnline = false;
let isVsAI = false;
let isMyTurn = true;
let roomId = null;

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = (row + col) % 2 === 1 ? "#3b3b3b" : "#e2e2e2";
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      const piece = board[row][col];
      if (piece !== 0) drawPiece(col, row, piece);
    }
  }
}

function drawPiece(col, row, piece) {
  const x = col * TILE_SIZE + TILE_SIZE / 2;
  const y = row * TILE_SIZE + TILE_SIZE / 2;
  ctx.beginPath();
  ctx.arc(x, y, TILE_SIZE / 2.5, 0, Math.PI * 2);
  ctx.fillStyle = piece === 1 ? "red" : "black";
  ctx.fill();
}

function initBoard() {
  board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 2; // black pieces
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 1; // red pieces
    }
  }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  if (board[toRow][toCol] !== 0) return false;

  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (Math.abs(dx) === 1 && dy === (currentPlayer === 1 ? -1 : 1)) return true;

  if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
    const jumpedRow = (fromRow + toRow) / 2;
    const jumpedCol = (fromCol + toCol) / 2;
    if (board[jumpedRow][jumpedCol] !== 0 &&
        board[jumpedRow][jumpedCol] !== currentPlayer) {
      board[jumpedRow][jumpedCol] = 0;
      return true;
    }
  }

  return false;
}

canvas.addEventListener("click", (e) => {
  if (isOnline && !isMyTurn) return;

  const col = Math.floor(e.offsetX / TILE_SIZE);
  const row = Math.floor(e.offsetY / TILE_SIZE);
  const clickedPiece = board[row][col];

  if (selected) {
    const [srcRow, srcCol] = selected;
    if (isValidMove(srcRow, srcCol, row, col)) {
      board[row][col] = board[srcRow][srcCol];
      board[srcRow][srcCol] = 0;
      selected = null;

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      drawBoard();

      if (isOnline) {
        socket.emit("move", { roomId, move: { board, turn: currentPlayer } });
        isMyTurn = false;
      } else if (isVsAI && currentPlayer === 2) {
        setTimeout(() => aiMove(), 500);
      }
    } else {
      selected = null;
    }
  } else {
    if (clickedPiece === currentPlayer) {
      selected = [row, col];
    }
  }
});

function aiMove() {
  let moves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === 2) {
        let dirs = [[1, -1], [1, 1], [2, -2], [2, 2]];
        for (let [dy, dx] of dirs) {
          const nr = r + dy;
          const nc = c + dx;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            if (isValidMove(r, c, nr, nc)) {
              moves.push({ from: [r, c], to: [nr, nc] });
            }
          }
        }
      }
    }
  }

  if (moves.length === 0) return;

  const move = moves[Math.floor(Math.random() * moves.length)];
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;

  board[tr][tc] = board[fr][fc];
  board[fr][fc] = 0;
  currentPlayer = 1;
  drawBoard();
}

function startGame(mode) {
  initBoard();
  drawBoard();
  currentPlayer = 1;
  selected = null;
  isOnline = mode === "online";
  isVsAI = mode === "ai";
}

function startOffline() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  startGame("offline");
}

function startVsAI() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  startGame("ai");
}

function showOnlineMenu() {
  document.getElementById("onlineMenu").style.display = "block";
}

function createRoom() {
  socket.emit("createRoom");
}

function joinRoom() {
  const id = document.getElementById("roomInput").value;
  if (id) socket.emit("joinRoom", id);
}

// Socket.IO Events
socket.on("roomCreated", (id) => {
  roomId = id;
  alert(`Room created: ${id}`);
});

socket.on("roomJoined", () => {
  alert("Player joined! Game starting...");
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  isMyTurn = true;
  startGame("online");
});

socket.on("roomError", (msg) => {
  alert(msg);
});

socket.on("move", (data) => {
  board = data.move.board;
  currentPlayer = data.move.turn;
  isMyTurn = true;
  drawBoard();
});
"); // Replace with your backend URL

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 75;
const ROWS = 8;
const COLS = 8;

let board = [];
let currentPlayer = 1; // 1 = red, 2 = black
let selected = null;
let isOnline = false;
let isVsAI = false;
let isMyTurn = true;
let roomId = null;

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = (row + col) % 2 === 1 ? "#3b3b3b" : "#e2e2e2";
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      const piece = board[row][col];
      if (piece !== 0) drawPiece(col, row, piece);
    }
  }
}

function drawPiece(col, row, piece) {
  const x = col * TILE_SIZE + TILE_SIZE / 2;
  const y = row * TILE_SIZE + TILE_SIZE / 2;
  ctx.beginPath();
  ctx.arc(x, y, TILE_SIZE / 2.5, 0, Math.PI * 2);
  ctx.fillStyle = piece === 1 ? "red" : "black";
  ctx.fill();
}

function initBoard() {
  board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 2; // black pieces
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < COLS; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 1; // red pieces
    }
  }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  if (board[toRow][toCol] !== 0) return false;

  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (Math.abs(dx) === 1 && dy === (currentPlayer === 1 ? -1 : 1)) return true;

  if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
    const jumpedRow = (fromRow + toRow) / 2;
    const jumpedCol = (fromCol + toCol) / 2;
    if (board[jumpedRow][jumpedCol] !== 0 &&
        board[jumpedRow][jumpedCol] !== currentPlayer) {
      board[jumpedRow][jumpedCol] = 0;
      return true;
    }
  }

  return false;
}

canvas.addEventListener("click", (e) => {
  if (isOnline && !isMyTurn) return;

  const col = Math.floor(e.offsetX / TILE_SIZE);
  const row = Math.floor(e.offsetY / TILE_SIZE);
  const clickedPiece = board[row][col];

  if (selected) {
    const [srcRow, srcCol] = selected;
    if (isValidMove(srcRow, srcCol, row, col)) {
      board[row][col] = board[srcRow][srcCol];
      board[srcRow][srcCol] = 0;
      selected = null;

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      drawBoard();

      if (isOnline) {
        socket.emit("move", { roomId, move: { board, turn: currentPlayer } });
        isMyTurn = false;
      } else if (isVsAI && currentPlayer === 2) {
        setTimeout(() => aiMove(), 500);
      }
    } else {
      selected = null;
    }
  } else {
    if (clickedPiece === currentPlayer) {
      selected = [row, col];
    }
  }
});

function aiMove() {
  let moves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === 2) {
        let dirs = [[1, -1], [1, 1], [2, -2], [2, 2]];
        for (let [dy, dx] of dirs) {
          const nr = r + dy;
          const nc = c + dx;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            if (isValidMove(r, c, nr, nc)) {
              moves.push({ from: [r, c], to: [nr, nc] });
            }
          }
        }
      }
    }
  }

  if (moves.length === 0) return;

  const move = moves[Math.floor(Math.random() * moves.length)];
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;

  board[tr][tc] = board[fr][fc];
  board[fr][fc] = 0;
  currentPlayer = 1;
  drawBoard();
}

function startGame(mode) {
  initBoard();
  drawBoard();
  currentPlayer = 1;
  selected = null;
  isOnline = mode === "online";
  isVsAI = mode === "ai";
}

function startOffline() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  startGame("offline");
}

function startVsAI() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  startGame("ai");
}

function showOnlineMenu() {
  document.getElementById("onlineMenu").style.display = "block";
}

function createRoom() {
  socket.emit("createRoom");
}

function joinRoom() {
  const id = document.getElementById("roomInput").value;
  if (id) socket.emit("joinRoom", id);
}

// Socket.IO Events
socket.on("roomCreated", (id) => {
  roomId = id;
  alert(`Room created: ${id}`);
});

socket.on("roomJoined", () => {
  alert("Player joined! Game starting...");
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  isMyTurn = true;
  startGame("online");
});

socket.on("roomError", (msg) => {
  alert(msg);
});

socket.on("move", (data) => {
  board = data.move.board;
  currentPlayer = data.move.turn;
  isMyTurn = true;
  drawBoard();
});
