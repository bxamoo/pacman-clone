// ===== ゴースト定義 =====
const ghosts = [
  { x: 13, y: 14, color: "red",    dirX: 1, dirY: 0, progress: 0 },
  { x: 14, y: 14, color: "pink",   dirX: -1, dirY: 0, progress: 0 },
  { x: 13, y: 15, color: "cyan",   dirX: 0, dirY: 1, progress: 0 },
  { x: 14, y: 15, color: "orange", dirX: 0, dirY: -1, progress: 0 }
];

// 1マス移動にかける時間（秒）
const GHOST_SPEED = 0.22;

// 壁判定
function isWall(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return map[y][x] === 1;
}

// プレイヤー方向をざっくり意識した方向選択
function chooseGhostDirection(g) {
  const px = pac.x;
  const py = pac.y;

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  // プレイヤーに近づく順にソート
  dirs.sort((a, b) => {
    const da = Math.hypot(px - (g.x + a.x), py - (g.y + a.y));
    const db = Math.hypot(px - (g.x + b.x), py - (g.y + b.y));
    return da - db;
  });

  // ランダム性を少し入れる
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

// ゴースト移動（アニメーション付き）
function updateGhost(g, dt) {
  g.progress += dt;

  if (g.progress >= GHOST_SPEED) {
    g.progress -= GHOST_SPEED;

    chooseGhostDirection(g);

    g.x += g.dirX;
    g.y += g.dirY;

    // トンネル処理
    if (g.x < -1) g.x = COLS;
    if (g.x > COLS) g.x = -1;
  }
}

// 衝突判定
function checkGhostCollision() {
  for (let g of ghosts) {
    if (g.x === pac.x && g.y === pac.y) {
      gameOver = true;
      messageEl.textContent = "ゲームオーバー！ Enterで再スタート";
    }
  }
}
