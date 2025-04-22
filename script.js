const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const mensagem = document.querySelector(".mensagem");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, velocity, score;
let highScore = localStorage.getItem("highScore") || 0;
let game;

initializeGame();

function initializeGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = randomPosition();
  velocity = 200;
  score = 0;

  scoreText.textContent = "Pontos: " + score;
  highScoreText.textContent = "Recorde: " + highScore;

  if (game) clearInterval(game);
  game = setInterval(draw, velocity);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDarkness();
  drawSnake();
  drawFood();
  moveSnake();
  checkCollision();
  scoreText.textContent = "Pontos: " + score;
  if (score > 0 && score % 10 === 0) mensagem.textContent = "uau você é muito pro";
  else mensagem.textContent = "";
}

function drawDarkness() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const centerX = snake[0].x * gridSize + gridSize / 2;
  const centerY = snake[0].y * gridSize + gridSize / 2;
  const radius = gridSize * 2.5;
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawSnake() {
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#40615a";
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function drawFood() {
  ctx.fillStyle = "#ff6347"; // cor do alimento (tomate)
  ctx.beginPath();
  ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomPosition();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // salva o recorde
    }
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tileCount || head.y >= tileCount ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y)
  ) {
    clearInterval(game);
    setTimeout(() => {
      alert("Game Over! Pontuação: " + score);
      initializeGame(); // reinicia o jogo
    }, 200);
  }
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

window.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if (["arrowup", "w"].includes(key) && direction.y === 0) direction = { x: 0, y: -1 };
  if (["arrowdown", "s"].includes(key) && direction.y === 0) direction = { x: 0, y: 1 };
  if (["arrowleft", "a"].includes(key) && direction.x === 0) direction = { x: -1, y: 0 };
  if (["arrowright", "d"].includes(key) && direction.x === 0) direction = { x: 1, y: 0 };
});
