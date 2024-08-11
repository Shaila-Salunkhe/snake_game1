// Define constants
const blockSize = 25;
const rows = 20;
const cols = 20;
let board;
let context;
let snake;
let food;
let direction;
let nextDirection;
let gameInterval;
let speed;
let currentScore;

// Initialize the game
window.onload = function() {
    board = document.getElementById("game-board");
    if (!board) {
        console.error("Game board not found");
        return;
    }
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    setupGame();

    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("difficulty").addEventListener("change", changeDifficulty);
};

// Setup initial game state
function setupGame() {
    snake = [{x: 10, y: 10}]; // Initial position of the snake
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    generateFood();
    document.addEventListener('keydown', changeDirection);
    currentScore = 0;
}

// Start the game
function startGame() {
    clearInterval(gameInterval); // Clear any existing game interval
    setupGame(); // Reset game state
    gameInterval = setInterval(updateGame, speed); // Start the game loop
}

// Change the game difficulty
function changeDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    switch (difficulty) {
        case 'easy':
            speed = 200;
            break;
        case 'medium':
            speed = 100;
            break;
        case 'hard':
            speed = 50;
            break;
        default:
            speed = 100;
    }
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed); // Restart game with new speed
    }
}

// Update the game state
function updateGame() {
    if (direction !== nextDirection) {
        if (direction === 'UP' && nextDirection !== 'DOWN') direction = nextDirection;
        if (direction === 'DOWN' && nextDirection !== 'UP') direction = nextDirection;
        if (direction === 'LEFT' && nextDirection !== 'RIGHT') direction = nextDirection;
        if (direction === 'RIGHT' && nextDirection !== 'LEFT') direction = nextDirection;
    }

    const head = { ...snake[0] };

    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(food);
        generateFood();
        currentScore += 10; // Increase score
    } else {
        snake.unshift(head);
        snake.pop();
    }

    if (isGameOver()) {
        gameOver();
        return;
    }

    drawGame();
}

// Draw the game state
function drawGame() {
    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "green";
    snake.forEach(segment => {
        context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });

    context.fillStyle = "red";
    context.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);

    // Draw score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Score: ${currentScore}`, 10, 20);
}

// Generate new food location
function generateFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
    };
}

// Change direction based on keyboard input
function changeDirection(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            nextDirection = 'LEFT';
            break;
        case 38: // Up arrow key
            nextDirection = 'UP';
            break;
        case 39: // Right arrow key
            nextDirection = 'RIGHT';
            break;
        case 40: // Down arrow key
            nextDirection = 'DOWN';
            break;
    }
}

// Check if the game is over
function isGameOver() {
    const head = snake[0];

    // Check for collision with walls
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) return true;

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }

    return false;
}

// Handle game over
function gameOver() {
    clearInterval(gameInterval);
    document.getElementById("score-card").classList.remove("hidden");
    document.getElementById("score-card").classList.add("fade-in");
    document.getElementById("score-card").innerHTML = `
        <h2>Game Over</h2>
        <p>Score: ${currentScore}</p>
        <button onclick="restartGame()">Restart</button>
    `;
}

// Restart the game
function restartGame() {
    document.getElementById("score-card").classList.add("hidden");
    setupGame();
    gameInterval = setInterval(updateGame, speed);
}
