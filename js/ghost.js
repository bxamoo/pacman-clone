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
  const py
