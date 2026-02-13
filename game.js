// Pong Game in JavaScript

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Ball properties
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 2;
let dy = -2;

// Paddle properties
const paddleHeight = 75;
const paddleWidth = 10;
let paddleY = (canvas.height - paddleHeight) / 2;
let upPressed = false;
let downPressed = false;

// Score variables
let playerScore = 0;
let aiScore = 0;

// AI variables
let aiPaddleY = (canvas.height - paddleHeight) / 2;
const aiSpeed = 4;

// Event listeners for paddle controls
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
        upPressed = true;
    } else if (e.key === 'ArrowDown') {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowUp') {
        upPressed = false;
    } else if (e.key === 'ArrowDown') {
        downPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Player: ' + playerScore, 8, 20);
    ctx.fillText('AI: ' + aiScore, canvas.width - 65, 20);
}

function collisionDetection() {
    if (x + ballRadius > canvas.width - paddleWidth && y > aiPaddleY && y < aiPaddleY + paddleHeight) {
        dx = -dx;
    } else if (x - ballRadius < paddleWidth && y > paddleY && y < paddleY + paddleHeight) {
        dx = -dx;
    } else if (x + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    } else if (x - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 2;
    dy = -2;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(0, paddleY);
    drawPaddle(canvas.width - paddleWidth, aiPaddleY);
    drawScore();

    collisionDetection();

    // Ball movement
    x += dx;
    y += dy;

    // Wall collision
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    // Player paddle controls
    if (upPressed && paddleY > 0) {
        paddleY -= 7;
    } else if (downPressed && paddleY < canvas.height - paddleHeight) {
        paddleY += 7;
    }

    // AI paddle movement
    if (aiPaddleY + paddleHeight / 2 < y) {
        aiPaddleY += aiSpeed;
    } else {
        aiPaddleY -= aiSpeed;
    }
}

setInterval(() => {
    draw();
}, 10);