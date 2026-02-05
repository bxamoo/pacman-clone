const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const messageEl = document.getElementById("message");

// ===== プレイヤー初期位置 =====
// ステージ下部中央に配置
const pac = { x: 13, y: 12 };

let score = 0;
let gameOver = false;
let win = false;

function eatDot(x, y) {
  if (map[y][x] === 2) {
    map[y][x] = 0;
    score += 10;
  }
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
          ctx.arc(px + TILE/2, py + TILE/2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.fillStyle = "#ffeb00";
  ctx.beginPath();
  ctx.arc(pac.x * TILE + TILE/2, pac.y * TILE + TILE/2, TILE/2 - 2, 0, Math.PI * 2);
  ctx.fill();

  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x * TILE + TILE/2, g.y * TILE + TILE/2, TILE/2 - 2, Math.PI, 0);
    ctx.rect(g.x * TILE + 2, g.y * TILE + TILE/2, TILE - 4, TILE/2);
    ctx.fill();
  });

  ctx.fillStyle = "#fff";
  ctx.font = "16px system-ui";
  ctx.fillText("SCORE: " + score, 8, 20);
}

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
