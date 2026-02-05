// ===== 基本設定 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");

const TILE = 16;
const COLS = 28;
const ROWS = 31;

// ===== マップ定義 =====
const baseMap = [
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
].map(r => r.split("").map(Number));

let map = baseMap.map(r => r.slice());

// 通路(0)をドット(2)に変換
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (map[y][x] === 0) map[y][x] = 2;
  }
}

// ===== プレイヤー =====
const pac = {
  x: 13,
  y: 23
};

// ===== ゴースト =====
const ghosts = [
  { x: 13, y: 14, color: "red",    dirX: 1, dirY: 0 },
  { x: 14, y: 14, color: "pink",   dirX: -1, dirY: 0 },
  { x: 13, y: 15, color: "cyan",   dirX: 0, dirY: 1 },
  { x: 14, y: 15, color: "orange", dirX: 0, dirY: -1 }
];

let score = 0;
let gameOver = false;
let win = false;

// ===== 壁判定 =====
function isWall(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return map[y][x] === 1;
}

// ===== ドットを食べる =====
function eatDot(x, y) {
  if (map[y][x] === 2) {
    map[y][x] = 0;
    score += 10;
  }
}

// ===== プレイヤー移動（1マス） =====
function movePac(dx, dy) {
  if (gameOver || win) return;

  const nx = pac.x + dx;
  const ny = pac.y + dy;

  if (!isWall(nx, ny)) {
    pac.x = nx;
    pac.y = ny;
    eatDot(nx, ny);
  }
}

// ===== ゴースト自動移動（毎フレーム） =====
function autoMoveGhost(g) {
  const nx = g.x + g.dirX;
  const ny = g.y + g.dirY;

  // 進行方向が壁 → 別方向を探す
  if (isWall(nx, ny)) {
    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    // ランダムに方向を混ぜる
    dirs.sort(() => Math.random() - 0.5);

    for (let d of dirs) {
      const tx = g.x + d.x;
      const ty = g.y + d.y;
      if (!isWall(tx, ty)) {
        g.dirX = d.x;
        g.dirY = d.y;
        break;
      }
    }
  }

  // 移動
  g.x += g.dirX;
  g.y += g.dirY;
}

// ===== 衝突判定 =====
function checkCollision() {
  for (let g of ghosts) {
    if (g.x === pac.x && g.y === pac.y) {
      gameOver = true;
      messageEl.textContent = "ゲームオーバー！ Enterで再スタート";
    }
  }
}

// ===== 描画 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // マップ
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const v = map[y][x];
      const px = x * TILE;
      const py = y * TILE;

      if (v === 1) {
        ctx.fillStyle = "#0011aa";
        ctx.fillRect(px, py, TILE, TILE);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, TILE, TILE);

        if (v === 2) {
          ctx.fillStyle = "#ffb8ae";
          ctx.beginPath();
          ctx.arc(px + 8, py + 8, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // パックマン
  ctx.fillStyle = "#ffeb00";
  ctx.beginPath();
  ctx.arc(pac.x * TILE + 8, pac.y * TILE + 8, 7, 0, Math.PI * 2);
  ctx.fill();

  // ゴースト
  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x * TILE + 8, g.y * TILE + 8, 7, Math.PI, 0);
    ctx.rect(g.x * TILE + 1, g.y * TILE + 8, 14, 8);
    ctx.fill();
  });

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "14px system-ui";
  ctx.fillText("SCORE: " + score, 8, 16);
}

// ===== キー入力 =====
window.addEventListener("keydown", e => {
  e.preventDefault(); // スクロール防止

  if (gameOver || win) {
    if (e.key === "Enter") location.reload();
    return;
  }

  if (e.key === "ArrowUp") movePac(0, -1);
  if (e.key === "ArrowDown") movePac(0, 1);
  if (e.key === "ArrowLeft") movePac(-1, 0);
  if (e.key === "ArrowRight") movePac(1, 0);
});

// ===== メインループ（ゴースト自動移動） =====
function loop() {
  if (!gameOver && !win) {
    ghosts.forEach(autoMoveGhost);
    checkCollision();
  }

  draw();
  requestAnimationFrame(loop);
}

draw();
loop();
