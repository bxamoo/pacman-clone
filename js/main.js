// ===== キャンバス =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");

// ===== プレイヤー =====
const pac = { x: 13, y: 23 };

let score = 0;
let gameOver = false;
let win = false;

// ドットを食べる
function eatDot(x, y) {
  if (map[y][x] === 2) {
    map[y][x] = 0;
    score += 10;
  }
}

// プレイヤー移動（1マス）
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

// 描画
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

// キー入力
window.addEventListener("keydown", e => {
  e.preventDefault();

  if (gameOver || win) {
    if (e.key === "Enter") location.reload();
    return;
  }

  if (e.key === "ArrowUp") movePac(0, -1);
  if (e.key === "ArrowDown") movePac(0, 1);
  if (e.key === "ArrowLeft") movePac(-1, 0);
  if (e.key === "ArrowRight") movePac(1, 0);
});

// メインループ
let last = 0;
function loop(t) {
  const dt = (t - last) / 1000;
  last = t;

  if (!gameOver && !win) {
    ghosts.forEach(g => updateGhost(g, dt));
    checkGhostCollision();
  }

  draw();
  requestAnimationFrame(loop);
}

draw();
requestAnimationFrame(loop);
