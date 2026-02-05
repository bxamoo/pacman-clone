// ===== ゴースト定義 =====
// ゴーストハウス中央に配置
const ghosts = [
  { x: 13, y: 7, color: "red",    dirX: 1, dirY: 0, progress: 0 },
  { x: 14, y: 7, color: "pink",   dirX: -1, dirY: 0, progress: 0 },
  { x: 13, y: 8, color: "cyan",   dirX: 0, dirY: 1, progress: 0 },
  { x: 14, y: 8, color: "orange", dirX: 0, dirY: -1, progress: 0 }
];

const GHOST_SPEED = 0.22;

function isWall(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return map[y][x] === 1;
}

function chooseGhostDirection(g) {
  const px = pac.x;
  const py = pac.y;

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  dirs.sort((a, b) => {
    const da = Math.hypot(px - (g.x + a.x), py - (g.y + a.y));
    const db = Math.hypot(px - (g.x + b.x), py - (g.y + b.y));
    return da - db;
  });

  if (Math.random() < 0.2) dirs.reverse();

  for (let d of dirs) {
    const nx = g.x + d.x;
    const ny = g.y + d.y;
    if (!isWall(nx, ny)) {
      g.dirX = d.x;
      g.dirY = d.y;
      return;
    }
  }
}

function updateGhost(g, dt) {
  g.progress += dt;

  if (g.progress >= GHOST_SPEED) {
    g.progress -= GHOST_SPEED;

    chooseGhostDirection(g);

    g.x += g.dirX;
    g.y += g.dirY;

    if (g.x < -1) g.x = COLS;
    if (g.x > COLS) g.x = -1;
  }
}

function checkGhostCollision() {
  for (let g of ghosts) {
    if (g.x === pac.x && g.y === pac.y) {
      gameOver = true;
      messageEl.textContent = "ゲームオーバー！ Enterで再スタート";
    }
  }
}
