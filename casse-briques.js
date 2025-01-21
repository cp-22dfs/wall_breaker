
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballPositionX = canvas.width / 2;
let ballPositionY = canvas.height - 30;
let dx = 6;
let dy = 10;
const radius = 10;

const paddleWidth = 120;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

const paddleImg = new Image();
paddleImg.src = "wood.jpg";

const ballImg = new Image();
ballImg.src = "dynamik.jpg";

const explodeImg = new Image();
explodeImg.src = "explosion.jpg";

const brickImg = new Image();
brickImg.src = "brick.jpg";

const heartImg = new Image();
heartImg.src = "heart.jpg";

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

const brickRowCount = 3;
const brickColumnCount = 6;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 50;
let totalBricks = brickRowCount * brickColumnCount;
let destroyedBricks = 0;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { ballPositionX: 0, ballPositionY: 0, status: 1 };
    }
}

let explosionX = 0;
let explosionY = 0;
let explosionTimer = 0;

let lives = 3;

function triggerExplosion(px, py) {
    explosionX = px;
    explosionY = py;
    explosionTimer = 20;
}

function drawPaddle() {
    ctx.drawImage(
        paddleImg,
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
    );
}

function drawBall() {
    ctx.drawImage(
        ballImg,
        ballPositionX - radius,
        ballPositionY - radius,
        radius * 2,
        radius * 2
    );
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.drawImage(brickImg, brickX, brickY, brickWidth, brickHeight);

            }
        }
    }
}

function drawExplosion() {
    if (explosionTimer > 0) {
        const imgSize = 40;
        ctx.drawImage(
            explodeImg,
            explosionX - imgSize / 2,
            explosionY - imgSize / 2,
            imgSize,
            imgSize
        );
        explosionTimer--;
    }
}

function drawLives() {
    const heartSize = 15;
    const heartPadding = 10;
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(
            heartImg,
            10 + i * (heartSize + heartPadding),
            10,
            heartSize,
            heartSize
        );
    }
}

function collisionDetectionBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ballPositionX + radius > b.x &&
                    ballPositionX - radius < b.x + brickWidth &&
                    ballPositionY + radius > b.y &&
                    ballPositionY - radius < b.y + brickHeight
                ) {
                    triggerExplosion(ballPositionX, ballPositionY);
                    b.status = 0;
                    destroyedBricks++;

                    dy = -dy;
                    if (destroyedBricks === totalBricks) {
                        //     alert("You Win!");
                        // document.location.reload();
                        const victoryMessage = document.createElement('div');
                        victoryMessage.textContent = "Congratulations! You've won!";
                        victoryMessage.style.fontSize = '24px';
                        victoryMessage.style.color = 'green';
                        victoryMessage.style.textAlign = 'center';
                        victoryMessage.style.marginTop = '20px';
                        document.body.appendChild(victoryMessage);
                        dy = 0;
                        dx = 0;
                        const restartButton = document.getElementById('resetButton')
                restartButton.textContent = "Recommencer la partie";
                restartButton.style.textAlign = 'center';
                restartButton.style.cursor = "pointer";
                restartButton.style.padding = "10px";
                restartButton.style.backgroundColor = "green"
                restartButton.style.color = "#fff";
                restartButton.style.borderRadius = "4px"
                restartButton.style.display = "block";
                restartButton.style.margin = "20px auto";
                restartButton.style.width = "150px"

                restartButton.addEventListener("click", function(){
                    lives = 3;
                    document.location.reload();
                });
                    }
                }
            }
        }
    }
}


function resetGame() {
    document.location.reload();
}

function drawLoose() {
    if (lives = 0) {

    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    drawExplosion();
    drawLives();
    collisionDetectionBricks();
    ballPositionX += dx;
    ballPositionY += dy;

    if (ballPositionX + dx > canvas.width - radius || ballPositionX + dx < radius) {
        dx = -dx;
    }

    if (ballPositionY + dy < radius) {
        dy = -dy;
    }
    else if (ballPositionY + dy > canvas.height - radius) {
        if (ballPositionX > paddleX && ballPositionX < paddleX + paddleWidth) {
            const hitPos = (ballPositionX - paddleX) / paddleWidth;
            const maxBounceAngle = Math.PI / 3;
            const bounceAngle = maxBounceAngle * (hitPos - 0.5);
            const speed = Math.sqrt(dx * dx + dy * dy);

            dx = speed * Math.sin(bounceAngle);
            dy = -speed * Math.cos(bounceAngle);
        } else {
            lives--;
            if (lives <= 0) {
                // alert("You Lost...");
                // lives = 3;
                // document.location.reload();
                const lossMessage = document.createElement('div');
                lossMessage.textContent = "You lost! You'll be eaten by John Pork!";
                lossMessage.style.fontSize = '24px';
                lossMessage.style.color = 'red';
                lossMessage.style.textAlign = 'center';
                lossMessage.style.marginTop = '20px';
                        document.body.appendChild(lossMessage);
                        dy = 0;
                        dx = 0;

                const restartButton = document.getElementById('resetButton')
                restartButton.textContent = "Recommencer la partie";
                restartButton.style.textAlign = 'center';
                restartButton.style.cursor = "pointer";
                restartButton.style.padding = "10px";
                restartButton.style.backgroundColor = "red"
                restartButton.style.color = "#fff";
                restartButton.style.borderRadius = "4px"
                restartButton.style.display = "block";
                restartButton.style.margin = "20px auto";
                restartButton.style.width = "150px"

                restartButton.addEventListener("click", function(){
                    lives = 3;
                    document.location.reload();
                });
               
            } else {
                ballPositionX = canvas.width / 2;
                ballPositionY = canvas.height - 30;
                dx = 6;
                dy = 10;

                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(draw);
}


draw();

