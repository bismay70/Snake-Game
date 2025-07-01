 const board = document.getElementById("game-board");
        const instructionText = document.getElementById("instruction");
        const logo = document.getElementById("logo");
        const score = document.getElementById("score");
        const highScoreText = document.getElementById("highScore");
        const startBtn = document.getElementById("startBtn");

        const gridSize = 20;
        let snake = [{ x: 10, y: 10 }];
        let food = generateFood();
        let highScore = 0;
        let direction = 'right';
        let gameInterval;
        let gameSpeedDelay = 200;
        let gameStarted = false;

        
        let eatSound, collisionSound;
        try {
            eatSound = new Audio('eat.mp3');
            collisionSound = new Audio('gameover.mp3');
        } catch (e) {
          
            eatSound = { play: () => {} };
            collisionSound = { play: () => {} };
        }

        function draw() {
            board.innerHTML = "";
            drawSnake(); 
            drawFood();
            updateScore();
           
            if (!gameStarted) {
                board.appendChild(logo);
                board.appendChild(instructionText);
            }
        }

        function drawSnake() {
            snake.forEach((segment) => {
                const snakeElement = createGameElement('div', 'snake');
                setPosition(snakeElement, segment);
                board.appendChild(snakeElement);
            });
        }

        function createGameElement(tag, className) {
            const element = document.createElement(tag);
            element.className = className;
            return element;
        }

        function setPosition(element, position) {
            element.style.gridColumn = position.x;
            element.style.gridRow = position.y;
        }

        function drawFood() {
            if (gameStarted) {
                const foodElement = createGameElement('div', 'food');
                setPosition(foodElement, food);
                board.appendChild(foodElement);
            }
        }
        
        function generateFood() {
            let newFood;
            do {
                newFood = {
                    x: Math.floor(Math.random() * gridSize) + 1,
                    y: Math.floor(Math.random() * gridSize) + 1
                };
            } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
            
            return newFood;
        }
        
        function move() {
            const head = { ...snake[0] };
            switch (direction) {
                case 'up':
                    head.y--;
                    break;
                case 'down':
                    head.y++;
                    break;
                case 'left':
                    head.x--;
                    break;
                case 'right':
                    head.x++;
                    break;
            }
        
            snake.unshift(head);
        
            if (head.x === food.x && head.y === food.y) {
                try {
                    eatSound.play();
                } catch (e) {
                   
                }
                food = generateFood();
                increaseSpeed();
                clearInterval(gameInterval); 
                gameInterval = setInterval(() => {
                    move();
                    checkCollision();
                    draw();
                }, gameSpeedDelay);
            } else {
                snake.pop();
            }
        }

        function startGame() {
            gameStarted = true; 
            instructionText.style.display = 'none';
            logo.style.display = 'none';
            gameInterval = setInterval(() => {
                move();
                checkCollision();
                draw();
            }, gameSpeedDelay);
        }
        
        document.addEventListener('keydown', handleArrowKeys);

        function handleArrowKeys(event) {
            if (!gameStarted) return;
            
          
            const oppositeDirections = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };
            
            let newDirection;
            switch (event.key) {
                case 'ArrowUp':
                    newDirection = 'up';
                    break;
                case 'ArrowDown':
                    newDirection = 'down';
                    break;
                case 'ArrowLeft':
                    newDirection = 'left';
                    break;
                case 'ArrowRight':
                    newDirection = 'right';
                    break;
                default:
                    return;
            }
            
            
            if (snake.length === 1 || oppositeDirections[direction] !== newDirection) {
                direction = newDirection;
            }
            
            event.preventDefault();
        }

        startBtn.addEventListener("click", () => {
            startGame();
            startBtn.style.display = "none"; 
        });
        
        function increaseSpeed() {
            if (gameSpeedDelay > 150) {
                gameSpeedDelay -= 5;
            } else if (gameSpeedDelay > 100) {
                gameSpeedDelay -= 3;
            } else if (gameSpeedDelay > 50) {
                gameSpeedDelay -= 2;
            } else if (gameSpeedDelay > 25) {
                gameSpeedDelay -= 1;
            }
        }
        
        function checkCollision() {
            const head = snake[0];
            if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
                try {
                    collisionSound.play();
                } catch (e) {
                    
                }
                resetGame();
            }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    try {
                        collisionSound.play();
                    } catch (e) {
                       
                    }
                    resetGame();
                }
            }
        }
        
        function resetGame() {
            updateHighScore();
            stopGame();
            snake = [{ x: 10, y: 10 }];
            food = generateFood();
            direction = 'right';
            gameSpeedDelay = 200;
            updateScore();
        }
        
        function updateScore() {
            const currentScore = snake.length - 1;
            score.textContent = currentScore.toString().padStart(3, '0');
        }

        function stopGame() {
            clearInterval(gameInterval);
            gameStarted = false;
            logo.style.display = 'block';
            instructionText.style.display = 'block';
            startBtn.style.display = 'block';
        }
        
        function updateHighScore() {
            const currentScore = snake.length - 1;
            if (currentScore > highScore) {
                highScore = currentScore;
                highScoreText.textContent = highScore.toString().padStart(3, '0');
            }
            highScoreText.style.display = 'block';
        }

        draw();
