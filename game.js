// Pong Game in JavaScript

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Ball properties
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 2;
let dy = -2;
let ballSpeedMultiplier = 1;

// Paddle properties
const paddleHeight = 75;
const paddleWidth = 10;
let paddleY = (canvas.height - paddleHeight) / 2;
let upPressed = false;
let downPressed = false;
let mouseY = canvas.height / 2;

// Score variables
let playerScore = 0;
let aiScore = 0;

// AI variables
let aiPaddleY = (canvas.height - paddleHeight) / 2;
const aiSpeed = 3.5;
let aiDifficulty = 1;

// Game state
let gameRunning = true;

// Event listeners for paddle controls
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
canvas.addEventListener('mousemove', mouseMoveHandler);

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

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#00FF00';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(xPos, yPos, color = '#0095DD') {
    ctx.beginPath();
    ctx.rect(xPos, yPos, paddleWidth, paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Player: ' + playerScore, 20, 30);
    ctx.fillText('AI: ' + aiScore, canvas.width - 120, 30);
    
    // Draw center line
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function collisionDetection() {
    // Right paddle (AI) collision
    if (x + ballRadius > canvas.width - paddleWidth && 
        y > aiPaddleY && 
        y < aiPaddleY + paddleHeight) {
        dx = -Math.abs(dx) * 1.05;
        let collidePoint = y - (aiPaddleY + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        dy = collidePoint * 5;
    }
    // Left paddle (Player) collision
    else if (x - ballRadius < paddleWidth && 
             y > paddleY && 
             y < paddleY + paddleHeight) {
        dx = Math.abs(dx) * 1.05;
        let collidePoint = y - (paddleY + paddleHeight / 2);
        collidePoint = collidePoint / (paddleHeight / 2);
        dy = collidePoint * 5;
    }
    // Ball goes out of bounds (right side - player scores)
    else if (x + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }
    // Ball goes out of bounds (left side - AI scores)
    else if (x - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = (Math.random() > 0.5 ? 1 : -1) * 2;
    dy = (Math.random() - 0.5) * 4;
    ballSpeedMultiplier = 1;
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    ballSpeedMultiplier = 1;
    resetBall();
    paddleY = (canvas.height - paddleHeight) / 2;
    aiPaddleY = (canvas.height - paddleHeight) / 2;
    gameRunning = true;
}

function draw() {
    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBall();
    drawPaddle(0, paddleY, '#00FF00');
    drawPaddle(canvas.width - paddleWidth, aiPaddleY, '#FF00FF');
    drawScore();

    if (!gameRunning) return;

    // Collision detection
    collisionDetection();

    // Ball movement
    x += dx * ballSpeedMultiplier;
    y += dy * ballSpeedMultiplier;

    // Wall collision (top and bottom)
    if (y + ballRadius > canvas.height || y - ballRadius < 0) {
        dy = -dy;
        if (y + ballRadius > canvas.height) {
            y = canvas.height - ballRadius;
        } else if (y - ballRadius < 0) {
            y = ballRadius;
        }
    }

    // Player paddle controls (keyboard or mouse)
    if (upPressed && paddleY > 0) {
        paddleY -= 7;
    } else if (downPressed && paddleY < canvas.height - paddleHeight) {
        paddleY += 7;
    }
    
    // Mouse control
    if (Math.abs(mouseY - paddleY) > 5) {
        if (mouseY < paddleY && paddleY > 0) {
            paddleY -= 5;
        } else if (mouseY > paddleY && paddleY < canvas.height - paddleHeight) {
            paddleY += 5;
        }
    }

    // AI paddle movement with difficulty scaling
    let targetY = y - (paddleHeight / 2);
    
    // Add some imperfection to AI
    let aiError = (Math.random() - 0.5) * 10 * (2 - aiDifficulty);
    targetY += aiError;
    
    // Increase difficulty gradually
    if (playerScore + aiScore > 5) {
        aiDifficulty = 1.3;
    }
    if (playerScore + aiScore > 10) {
        aiDifficulty = 1.6;
    }

    if (aiPaddleY + paddleHeight / 2 < targetY) {
        aiPaddleY += aiSpeed * aiDifficulty;
    } else {
        aiPaddleY -= aiSpeed * aiDifficulty;
    }
    
    // Keep AI paddle in bounds
    if (aiPaddleY < 0) {
        aiPaddleY = 0;
    } else if (aiPaddleY + paddleHeight > canvas.height) {
        aiPaddleY = canvas.height - paddleHeight;
    }
}

// Game loop at 60 FPS
setInterval(() => {
    draw();
}, 1000 / 60);