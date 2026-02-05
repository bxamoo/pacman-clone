// ===== 基本設定 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");

const TILE_SIZE = 16;
const COLS = 28;
const ROWS = 31;

// マップ定義
// 0: 通路, 1: 壁, 2: ドット, 3: パワーエサ（今回はスコア用のみ）
const baseLevel = [
  "1111111111111111111111111111",
  "1222222222111222222222222221",
  "1211112112111211112112111121",
  "1311112112111211112112111131",
  "1222222222222222222222222221",
  "1211112112111211112112111121",
  "1222222112222222112222222221",
  "1111112111112111112111111111",
  "0000012111112111112110000000",
  "1111112112222222112111111111",
  "2222222221111111222222222222",
  "1211112111111111112112111121",
  "1222222112222222112222222221",
  "1111112112111211112111111111",
  "0000012112111211112100000000",
  "1111112112111211112111111111",
  "1222222222222222222222222221",
  "1211112112111211112112111121",
  "1311112112222222112112111131",
  "1222222111112111112222222221",
  "1111112111112111112111111111",
  "0000012222220000222222200000",
  "1111112111112111112111111111",
  "1222222222111222222222222221",
  "1211112112111211112112111121",
  "1222222112222222112222222221",
  "1111112111112111112111111111",
  "1222222222222222222222222221",
  "1211111111111211111111111121",
  "1222222222222222222222222221",
  "1111111111111111111111111111"
].map(row => row.split("").map(Number));

const level = baseLevel.map(row => row.slice());

// ドット配置（0の通路にもドットを置きたいので加工）
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (level[r][c] === 0) {
      level[r][c] = 2; // 通路をドットありに
    }
  }
}

// ===== プレイヤー（パックマン） =====
const pacman = {
  x: 13,
  y: 23,
  dirX: 0,
  dirY: 0,
  nextDirX: 0,
  nextDirY: 0,
  speed: 0.1,
  angle: 0
};

// ===== ゴースト =====
const ghosts = [
  { x: 13, y: 14, dirX: 1, dirY: 0, color: "red",    speed: 0.09 },
  { x: 14, y: 14, dirX: -1, dirY: 0, color: "pink",   speed: 0.085 },
  { x: 13, y: 15, dirX: 0, dirY: 1, color: "cyan",    speed: 0.08 },
  { x: 14, y: 15, dirX: 0, dirY: -1, color: "orange", speed: 0.08 }
];

let score = 0;
let dotsTotal = 0;
let gameOver = false;
let win = false;

// ドット総数カウント
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (level[r][c] === 2 || level[r][c] === 3) dotsTotal++;
  }
}

// ===== 入力 =====
window.addEventListener("keydown", e => {
  if (gameOver || win) {
    if (e.key === "Enter") {
      resetGame();
    }
    return;
  }
  switch (e.key) {
    case "ArrowUp":
      pacman.nextDirX = 0; pacman.nextDirY = -1;
      break;
    case "ArrowDown":
      pacman.nextDirX = 0; pacman.nextDirY = 1;
      break;
    case "ArrowLeft":
      pacman.nextDirX = -1; pacman.nextDirY = 0;
      break;
    case "ArrowRight":
      pacman.nextDirX = 1; pacman.nextDirY = 0;
      break;
  }
});

// ===== ユーティリティ =====
function isWall(x, y) {
  const cx = Math.round(x);
  const cy = Math.round(y);
  if (cy < 0 || cy >= ROWS || cx < 0 || cx >= COLS) return true;
  return level[cy][cx] === 1;
}

function eatDot(x, y) {
  const cx = Math.round(x);
  const cy = Math.round(y);
  if (cy < 0 || cy >= ROWS || cx < 0 || cx >= COLS) return;
  if (level[cy][cx] === 2) {
    level[cy][cx] = 0;
    score += 10;
    dotsTotal--;
  } else if (level[cy][cx] === 3) {
    level[cy][cx] = 0;
    score += 50;
    dotsTotal--;
  }
  if (dotsTotal <= 0 && !win) {
    win = true;
    messageEl.textContent = "クリア！ Enterキーでリスタート";
  }
}

function resetGame() {
  // マップを再生成
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = baseLevel[r][c];
      level[r][c] = (v === 0) ? 2 : v;
    }
  }

  dotsTotal = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (level[r][c] === 2 || level[r][c] === 3) dotsTotal++;
    }
  }

  pacman.x = 13;
  pacman.y = 23;
  pacman.dirX = 0;
  pacman.dirY = 0;
  pacman.nextDirX = 0;
  pacman.nextDirY = 0;

  ghosts[0].x = 13; ghosts[0].y = 14; ghosts[0].dirX = 1;  ghosts[0].dirY = 0;
  ghosts[1].x = 14; ghosts[1].y = 14; ghosts[1].dirX = -1; ghosts[1].dirY = 0;
  ghosts[2].x = 13; ghosts[2].y = 15; ghosts[2].dirX = 0;  ghosts[2].dirY = 1;
  ghosts[3].x = 14; ghosts[3].y = 15; ghosts[3].dirX = 0;  ghosts[3].dirY = -1;

  score = 0;
  gameOver = false;
  win = false;
  messageEl.textContent = "";
}

// ===== 更新処理 =====
let lastTime = 0;
function update(timestamp) {
  const dt = (timestamp - lastTime) / 16.67; // 60fps基準
  lastTime = timestamp;

  if (!gameOver && !win) {
    updatePacman(dt);
    updateGhosts(dt);
    checkCollisions();
  }

  draw();
  requestAnimationFrame(update);
}

function updatePacman(dt) {
  // 次の方向に曲がれるかチェック（タイル中心付近でのみ）
  const nearCenterX = Math.abs(pacman.x - Math.round(pacman.x)) < 0.15;
  const nearCenterY = Math.abs(pacman.y - Math.round(pacman.y)) < 0.15;
  if (nearCenterX && nearCenterY) {
    const targetX = Math.round(pacman.x) + pacman.nextDirX;
    const targetY = Math.round(pacman.y) + pacman.nextDirY;
    if (!isWall(targetX, targetY)) {
      pacman.dirX = pacman.nextDirX;
      pacman.dirY = pacman.nextDirY;
    }
  }

  // 移動
  let newX = pacman.x + pacman.dirX * pacman.speed * dt;
  let newY = pacman.y + pacman.dirY * pacman.speed * dt;

  // トンネル（左右端）
  if (newX < -1) newX = COLS;
  if (newX > COLS) newX = -1;

  if (!isWall(newX, pacman.y)) {
    pacman.x = newX;
  }
  if (!isWall(pacman.x, newY)) {
    pacman.y = newY;
  }

  // ドットを食べる
  eatDot(pacman.x, pacman.y);

  // 口パク用
  pacman.angle += 0.2 * dt;
}

function updateGhosts(dt) {
  ghosts.forEach(g => {
    // タイル中心付近でランダム＋追尾気味に方向転換
    const nearCenterX = Math.abs(g.x - Math.round(g.x)) < 0.15;
    const nearCenterY = Math.abs(g.y - Math.round(g.y)) < 0.15;
    if (nearCenterX && nearCenterY) {
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];
      // パックマンに少し寄るようにソート
      dirs.sort((a, b) => {
        const ax = Math.round(g.x) + a.x;
        const ay = Math.round(g.y) + a.y;
        const bx = Math.round(g.x) + b.x;
        const by = Math.round(g.y) + b.y;
        const da = Math.hypot(pacman.x - ax, pacman.y - ay);
        const db = Math.hypot(pacman.x - bx, pacman.y - by);
        return da - db;
      });

      for (let d of dirs) {
        const tx = Math.round(g.x) + d.x;
        const ty = Math.round(g.y) + d.y;
        if (!isWall(tx, ty) && !(d.x === -g.dirX && d.y === -g.dirY)) {
          g.dirX = d.x;
          g.dirY = d.y;
          break;
        }
      }
    }

    let newX = g.x + g.dirX * g.speed * dt;
    let newY = g.y + g.dirY * g.speed * dt;

    // トンネル
    if (newX < -1) newX = COLS;
    if (newX > COLS) newX = -1;

    if (!isWall(newX, g.y)) {
      g.x = newX;
    }
    if (!isWall(g.x, newY)) {
      g.y = newY;
    }
  });
}

function checkCollisions() {
  for (let g of ghosts) {
    const dist = Math.hypot(pacman.x - g.x, pacman.y - g.y);
    if (dist < 0.6) {
      gameOver = true;
      messageEl.textContent = "ゲームオーバー… Enterキーでリスタート";
      break;
    }
  }
}

// ===== 描画 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // マップ
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = level[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (tile === 1) {
        ctx.fillStyle = "#0011aa";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        if (tile === 2) {
          ctx.fillStyle = "#ffb8ae";
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // パックマン
  const px = pacman.x * TILE_SIZE + TILE_SIZE / 2;
  const py = pacman.y * TILE_SIZE + TILE_SIZE / 2;
  const mouth = (Math.sin(pacman.angle) + 1) / 4 + 0.1; // 0.1〜0.6くらい
  let dirAngle = 0;
  if (pacman.dirX === 1) dirAngle = 0;
  else if (pacman.dirX === -1) dirAngle = Math.PI;
  else if (pacman.dirY === -1) dirAngle = -Math.PI / 2;
  else if (pacman.dirY === 1) dirAngle = Math.PI / 2;

  ctx.fillStyle = "#ffeb00";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(
    px,
    py,
    TILE_SIZE / 2 - 1,
    dirAngle + mouth * Math.PI,
    dirAngle - mouth * Math.PI,
    false
  );
  ctx.closePath();
  ctx.fill();

  // ゴースト
  ghosts.forEach(g => {
    const gx = g.x * TILE_SIZE + TILE_SIZE / 2;
    const gy = g.y * TILE_SIZE + TILE_SIZE / 2;
    const w = TILE_SIZE - 2;
    const h = TILE_SIZE - 2;

    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(gx, gy - h * 0.1, w / 2, Math.PI, 0);
    ctx.rect(gx - w / 2, gy - h * 0.1, w, h * 0.6);
    ctx.fill();

    // 目
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(gx - 3, gy - 3, 3, 0, Math.PI * 2);
    ctx.arc(gx + 3, gy - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(gx - 3, gy - 3, 1.5, 0, Math.PI * 2);
    ctx.arc(gx + 3, gy - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "14px system-ui";
  ctx.fillText("SCORE: " + score, 8, 16);
}

// スタート
resetGame();
requestAnimationFrame(update);
