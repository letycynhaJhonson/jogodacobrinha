const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
const bgm = document.getElementById("bgm");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let foodColor = getRandomColor();
let snakeColor = "#40615a";
let gameOver = false;
let score = 0;
let highScore = 0;  // Inicia com 0, pois queremos zerar o recorde.
let lightRadius = 80;  // Lanterna mais suave
let running = false;
let interval;

highScoreDisplay.textContent = highScore;

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function getRandomColor() {
  const colors = ["#ff6b6b", "#6bcB77", "#4d96ff", "#f7c948", "#9f7aea"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawDarkness() {
  ctx.fillStyle = "#000000cc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const head = snake[0];
  const centerX = head.x * gridSize + gridSize / 2;
  const centerY = head.y * gridSize + gridSize / 2;

  const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, lightRadius);
  gradient.addColorStop(0, "rgba(255,255,255,0.06)");
  gradient.addColorStop(1, "rgba(0,0,0,0.98)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }
}

function update() {
  if (!running) return;

  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)) {
    gameOver = true;
    running = false;
    clearInterval(interval);
    message.textContent = `Você perdeu! Pontuação: ${score}. Pressione qualquer tecla para jogar.`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    snakeColor = foodColor; // atualiza a cor depois de comer
    food = getRandomPosition();
    foodColor = getRandomColor();

    if (score % 10 === 0) {
      message.textContent = "uau você é muito pro";
      setTimeout(() => message.textContent = "", 2000);
    }
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDarkness();
  drawFood();
  drawSnake();
  update();
}

document.addEventListener("keydown", (e) => {
  if (!running) {
    resetGame();
    return;
  }

  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key) && velocity.y !== 1) velocity = { x: 0, y: -1 };
  else if (["arrowdown", "s"].includes(key) && velocity.y !== -1) velocity = { x: 0, y: 1 };
  else if (["arrowleft", "a"].includes(key) && velocity.x !== 1) velocity = { x: -1, y: 0 };
  else if (["arrowright", "d"].includes(key) && velocity.x !== -1) velocity = { x: 1, y: 0 };
});

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  food = getRandomPosition();
  foodColor = getRandomColor();
  snakeColor = "#40615a";
  score = 0;
  scoreDisplay.textContent = score;
  gameOver = false;
  message.textContent = "";
  running = true;
  bgm.play();
  clearInterval(interval);
  interval = setInterval(draw, 150);
}

resetGame();
