class Snake {
    constructor(x, y, size, initialSpeed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y: this.y}];
        this.rotateX = 0;
        this.rotateY = 1;
        this.speed = initialSpeed;
    }
    
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    move() {
        let newRect;

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift();
        this.tail.push(newRect);
    }
}

class Apple {
    constructor() {
        let isTouching;

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true;
                }
            }

            this.size = snake.size;
            this.color = "red"

            if (!isTouching) {
                break;
            }
        }
    }
}

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
let gameInterval;
let isGameOver = false;
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);
let gameOverInterval;

let snake = new Snake(20, 20, 20, 5);
let apple = new Apple();

window.onload = () => {
    gameLoop();
}

function gameLoop() {
    // Second parameter specifies the fps
    gameInterval = setInterval(show, 1000 / snake.speed);
};

function show() {
    if (!isGameOver) {
    update();
    draw();
}
};

function checkSelfCollision() {
    const head = snake.tail[snake.tail.length - 1];

    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (head.x === snake.tail[i].x && head.y === snake.tail[i].y) {
            // Snake collided with itself
            gameOver();
        }
    }
};

function drawGameOver() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over!", 128, 128);
    ctx.fillText("Your score is: " + (snake.tail.length - 1), 128, 192);
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);  // Stop the game loop
    drawGameOver();
    // Start a new interval for drawing the game over message
    gameOverInterval = setInterval(drawGameOver, 1000 / 2);
};

function resetGame() {
    isGameOver = false;
    clearInterval(gameInterval);
    clearInterval(gameOverInterval);  // Clear the game over message interval
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();  // Draw the initial state
    snake = new Snake(20, 20, 20, 5);
    apple = new Apple();
    gameInterval = setInterval(show, 1000 / snake.speed);  // Start a new game loop
};

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    checkSelfCollision();
    eatApple();
    checkHitWall();
};

function eatApple() {
    if (snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y) {
            snake.tail[snake.tail.length] = { x: apple.x, y: apple.y };
            apple = new Apple();
            snake.setSpeed(snake.speed + 1);
            clearInterval(gameInterval);  // Clear the current interval
            gameInterval = setInterval(show, 1000 / snake.speed);
        }
};

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1];

    if (headTail.x == -snake.size) {
        headTail.x = canvas.width - snake.size;
    } else if (headTail.x == canvas.width) {
        headTail.x = 0;
    } else if (headTail.y == -snake.size) {
        headTail.y = canvas.height - snake.size;
    } else if (headTail.y == canvas.height) {
        headTail.y = 0;
    }
};

function draw() {
    createRect(0, 0, canvas.width, canvas.height, "#000");
    createRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
        snake.size - 5, snake.size - 5, "#00FF42")
    }

    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 64);
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
};

function createRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if(!isGameOver) {

        if (event.keyCode == 37 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        }
    }
    }, 1)

});
