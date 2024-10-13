// Select necessary DOM elements
const grid = document.querySelector(".grid"); // Game grid
const resultDisplay = document.querySelector(".results"); // Display for results
const livesDisplay = document.createElement("div"); // Display for lives
const countdownDisplay = document.querySelector('.countdown'); // Display for countdown
const pauseOverlay = document.querySelector(".pause-overlay"); // Overlay for pause
const gameOverOverlay = document.getElementById("game-over-overlay"); // Overlay for game over
const gameOverMessage = document.getElementById("game-over-message"); // Message for game over
const StartBtn = document.getElementById("start-btn"); // Start button
const continueBtn = document.getElementById("continue-btn"); // Continue button
const restartBtn = document.getElementById("restart-btn"); // Restart button
const finalRestartBtn = document.getElementById("final-restart-btn"); // Final restart button

// Game state variables
let currentShooterIndex = 382; // Initial position of the shooter
const width = 20; // Width of the grid
let aliensRemoved = []; // Array to track removed aliens
let isGoingRight = true; // Direction of alien movement
let direction = 1; // Direction value for alien movement
let results = 0; // Game results
let speed = 600; // Speed of the game
let isPaused = false; // Pause state
let playerLives = 3; // Player lives
let score = 0; // Player score
let startTime = new Date().getTime(); // Start time of the game
let totalTime = 45; // Total time for the game
let remainingTime = totalTime; // Remaining time
let countdownInterval; // Interval for countdown
let invaderLaserIntervals = []; // Intervals for invader lasers
let canShoot = true; // Flag to check if the player can shoot
let canSpecialShoot = true; // Flag to check if the player can special shoot
let isShooting = false; // Shooting state
let specialShooting = false; // Special shooting state
let animationFrameId; // ID for animation frame
const normalShootCooldownTime = 1000; // Cooldown time for normal shooting
const specialShootCooldownTime = 5000; // Cooldown time for special shooting
const targetFPS = 60; // Target frames per second
const frameDuration = 1000 / targetFPS; // Duration of each frame
let lastTimestamp = 0; // Last timestamp for animation
let lastMoveTime = 0; // Last move time for invaders
let invaderMoveInterval = 500; // Interval for invader movement
const minMoveInterval = 100; // Minimum interval for invader movement

// Load the images
const invaderImg = new Image();
invaderImg.src = 'images/invader.png';

const shooterImg = new Image();
shooterImg.src = 'images/shooter.png';

// Define the positions of the invaders
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49
];

// Create the overlay element
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Move the start button inside the overlay
overlay.appendChild(StartBtn);

let lastCountdownTime = 0;

function countdownLoop(timestamp) {
    if (!isPaused){
        if (timestamp - lastCountdownTime >= 1000){
            updateCountdown();
            lastCountdownTime = timestamp;
        }
    }
    countdownInterval = requestAnimationFrame(countdownLoop);
}

let lastInvaderShootTime = 0;
let invaderShootInterval = 1000 + Math.random() * 2000;

// Start the countdown loop
countdownInterval = requestAnimationFrame(countdownLoop);

function invaderShootLoop(timestamp) {
    if (!isPaused) {
        if (timestamp - lastInvaderShootTime >= invaderShootInterval) {
            invaderShoot();
            lastInvaderShootTime = timestamp;
            invaderShootInterval = 1000 + Math.random() * 2000; // Reset interval
        }
    }
    requestAnimationFrame(invaderShootLoop);
}

// Start the invader shooting loop
requestAnimationFrame(invaderShootLoop);

// Function to start the game
function startGame() {
    // Hide the start button and overlay
    StartBtn.classList.add('hidden');
    overlay.classList.add('hidden');

     // Hide the title and instructions
     document.querySelector('.title').classList.add('hidden');
     document.querySelectorAll('.instructions').forEach(function(element) {
         element.classList.add('hidden');
     });
    
    // Show the game elements
    resultDisplay.classList.remove('hidden');
    countdownDisplay.classList.remove('hidden');
    grid.classList.remove('hidden');
    pauseOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');

    // Initialize game elements
    createGrid();
    updateLivesDisplay();
    countdownInterval = requestAnimationFrame(countdownLoop);
    drawShooter();
    drawInvaders(); // Ensure invaders are drawn
    animationFrameId = requestAnimationFrame(moveInvaders);
    requestAnimationFrame(invaderShootLoop);
}

// Add event listener for the "keydown" event to start the game with the "Space" key
document.addEventListener('keydown', (e) => {
    if ((e.key === "Enter" || e.key === " ") && document.activeElement === StartBtn) {
        e.preventDefault(); // Prevent the default action (scrolling or expanding the grid)
        startGame();
    }
});



// Show the overlay and start button initially
overlay.classList.remove('hidden');
StartBtn.classList.remove('hidden');

// Function to create the grid
function createGrid() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
    }
}

// Function to draw the invaders
function drawInvaders() {
    const squares = Array.from(document.querySelectorAll(".grid div"));
    alienInvaders.forEach((invader, index) => {
        if (!aliensRemoved.includes(index) && squares[invader]) {
            squares[invader].style.backgroundImage = `url(${invaderImg.src})`;
            squares[invader].style.backgroundSize = 'cover';
            squares[invader].style.backgroundRepeat = 'no-repeat';
        }
    });
}

// Function to remove the invaders
function removeInvaders() {
    const squares = Array.from(document.querySelectorAll(".grid div"));
    alienInvaders.forEach(invader => {
        if (squares[invader]) { // Check if the element exists
            squares[invader].style.backgroundImage = '';
            squares[invader].classList.remove("invader");
        }
    });
}

// Function to calculate score in real-time
function updateScore() {
    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 1000;
    const timePenalty = Math.floor(timeElapsed * 5);
    const points = 100 - timePenalty;
    score += Math.max(points, 10);
    resultDisplay.innerHTML = `Score: ${score}`;
}

// Function to update the displayed lives
function updateLivesDisplay() {
    livesDisplay.innerHTML = `Lives: ${playerLives}`; // Use template literal to insert playerLives
    livesDisplay.classList.add('lives'); // Add the 'lives' class for styling
    document.body.insertBefore(livesDisplay, document.body.firstChild); // Insert at the beginning of the body
}

// Function to update the countdown timer
function updateCountdown() {
    if (remainingTime > 0 && !isPaused) {
        remainingTime--;
        countdownDisplay.innerHTML = `Time Left: ${remainingTime}s`;
    } else if (remainingTime <= 0) {
        cancelAnimationFrame(countdownInterval);
        gameOver('TIME UP! Game Over', false);
    }
}

Promise.all([
    new Promise((resolve) => invaderImg.onload = resolve),
    new Promise((resolve) => shooterImg.onload = resolve)
]).then(() => {
    // Game assets loaded
});

function drawShooter() {
    const squares = Array.from(document.querySelectorAll(".grid div"));
    squares[currentShooterIndex].style.backgroundImage = `url(${shooterImg.src})`;
    squares[currentShooterIndex].style.backgroundSize = 'cover';
    squares[currentShooterIndex].style.backgroundRepeat = 'no-repeat';
    squares[currentShooterIndex].classList.add("shooter");
}

function removeShooter() {
    const squares = Array.from(document.querySelectorAll(".grid div"));
    if (squares[currentShooterIndex]) {
        squares[currentShooterIndex].style.backgroundImage = '';
        squares[currentShooterIndex].classList.remove("shooter");
    }
}

function moveShooter(e) {
    if (isPaused) return;

    removeShooter();
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    drawShooter();
}

document.addEventListener('keydown', moveShooter);

function moveInvaders(timestamp) {
    // If the game is paused, exit the function early
    if (isPaused) return;

    // Get all the squares in the grid
    const squares = Array.from(document.querySelectorAll(".grid div"));
    
    // Calculate the time elapsed since the last frame
    const elapsed = timestamp - lastTimestamp;

    // Check if enough time has passed to update the frame
    if (elapsed > frameDuration) {
        // Calculate the time since the last invader move
        const timeSinceLastMove = timestamp - lastMoveTime;
        
        // Check if enough time has passed to move the invaders
        if (timeSinceLastMove > invaderMoveInterval) {
            // Check if the invaders are at the left or right edge of the grid
            const leftEdge = alienInvaders[0] % width === 0;
            const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
            
            // Remove the current invaders from the grid
            removeInvaders();

            // If the invaders are at the right edge and moving right, move them down and change direction
            if (rightEdge && isGoingRight) {
                for (let i = 0; i < alienInvaders.length; i++) {
                    alienInvaders[i] += width;
                }
                direction = -1;
                isGoingRight = false;
            }

            // If the invaders are at the left edge and moving left, move them down and change direction
            if (leftEdge && !isGoingRight) {
                for (let i = 0; i < alienInvaders.length; i++) {
                    alienInvaders[i] += width;
                }
                direction = 1;
                isGoingRight = true;
            }

            // Move the invaders in the current direction
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += direction;
            }

            // Draw the invaders in their new positions
            drawInvaders();

            // Update the last move time
            lastMoveTime = timestamp;
        }

        // Update the last timestamp
        lastTimestamp = timestamp;
    }

    // Schedule the next frame
    animationFrameId = requestAnimationFrame(moveInvaders);
}

// Start the animation loop
animationFrameId = requestAnimationFrame(moveInvaders);

function shoot() {
    if (!canShoot) return;

    const squares = Array.from(document.querySelectorAll(".grid div"));
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    canShoot = false;
    setTimeout(() => canShoot = true, normalShootCooldownTime);

    function moveLaser() {
        if (isPaused) return;

        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;

        if (currentLaserIndex >= 0) {
            squares[currentLaserIndex].classList.add("laser");

            if (squares[currentLaserIndex].style.backgroundImage.includes('invader.png')) {
                let alienIndex = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienIndex);
                squares[currentLaserIndex].style.backgroundImage = '';
                squares[currentLaserIndex].classList.remove("laser");

                updateScore();

                if (invaderMoveInterval > minMoveInterval) {
                    invaderMoveInterval -= 20;
                }

                cancelAnimationFrame(laserId);
            } else {
                laserId = requestAnimationFrame(moveLaser);
            }
        }
    }

    laserId = requestAnimationFrame(moveLaser);
}

// Special shooting (Down arrow) with 3 shots and 5-second cooldown
function specialShoot() {
    if (!canSpecialShoot) return;

    const squares = Array.from(document.querySelectorAll(".grid div"));
    canSpecialShoot = false;
    setTimeout(() => canSpecialShoot = true, specialShootCooldownTime);

    let shots = 3; // Number of consecutive shots

    function fireSpecialShot() {
        if (shots === 0) return;

        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            if (isPaused) return;

            squares[currentLaserIndex].classList.remove("laser");
            currentLaserIndex -= width;

            if (currentLaserIndex >= 0) {
                squares[currentLaserIndex].classList.add("laser");

                if (squares[currentLaserIndex].style.backgroundImage.includes('invader.png')) {
                    let alienIndex = alienInvaders.indexOf(currentLaserIndex);
                    aliensRemoved.push(alienIndex);
                    squares[currentLaserIndex].style.backgroundImage = '';
                    squares[currentLaserIndex].classList.remove("laser");

                    updateScore();

                    cancelAnimationFrame(laserId);
                } else {
                    laserId = requestAnimationFrame(moveLaser);
                }
            }
        }

        shots--;
        laserId = requestAnimationFrame(moveLaser);

        setTimeout(fireSpecialShot, 50);
    }

    fireSpecialShot();
}

function togglePause(e) {
    if (e.key === "Escape" || e.key.toLowerCase() === "p") {
        isPaused = !isPaused;

        if (isPaused) {
            pauseOverlay.style.display = "block";
            cancelAnimationFrame(animationFrameId);
            clearInterval(countdownInterval);
            invaderLaserIntervals.forEach(interval => clearInterval(interval));
        } else {
            pauseOverlay.style.display = "none";
            countdownInterval = setInterval(updateCountdown, 1000);
            animationFrameId = requestAnimationFrame(moveInvaders);
            startInvaderShooting();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp" && !isShooting) {
        isShooting = true;
        shoot();
    }

    if (e.key === "ArrowDown" && !specialShooting && canSpecialShoot) {
        specialShooting = true;
        specialShoot();
    }

    if (e.key === "Escape" || e.key.toLowerCase() === "p") {
        togglePause(e);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowUp") {
        isShooting = false;
    }

    if (e.key === "ArrowDown") {
        specialShooting = false;
    }
});

function gameOver(message, isWin) {
    gameOverMessage.innerHTML = message;
    gameOverOverlay.style.display = "block";
    clearInterval(countdownInterval);
    cancelAnimationFrame(animationFrameId);
    invaderLaserIntervals.forEach(interval => clearInterval(interval));
    document.removeEventListener('keydown', moveShooter);
    document.removeEventListener('keydown', shoot);
    document.removeEventListener('keydown', specialShoot);
}

function startInvaderShooting() {
    invaderLaserIntervals.push(setInterval(invaderShoot, 1000 + Math.random() * 2000));
}

function invaderShoot() {
    const squares = Array.from(document.querySelectorAll(".grid div"));
    let randomInvaderIndex = alienInvaders[Math.floor(Math.random() * alienInvaders.length)];

    if (!aliensRemoved.includes(alienInvaders.indexOf(randomInvaderIndex))) {
        let laserId;
        let currentLaserIndex = randomInvaderIndex;

        function moveLaserDown() {
            if (isPaused) return;
        
            const squares = Array.from(document.querySelectorAll(".grid div"));
            if (squares[currentLaserIndex]) {
                squares[currentLaserIndex].classList.remove("invader-laser");
            }
            currentLaserIndex += width;
        
            if (currentLaserIndex < width * width) {
                if (squares[currentLaserIndex]) {
                    squares[currentLaserIndex].classList.add("invader-laser");
        
                    if (currentLaserIndex === currentShooterIndex) {
                        squares[currentLaserIndex].classList.remove("invader-laser");
                        playerLives--;
                        updateLivesDisplay();
        
                        if (playerLives === 0) {
                            gameOver('GAME OVER - You were hit 3 times!', false);
                        }
        
                        cancelAnimationFrame(laserId);
                    } else {
                        laserId = requestAnimationFrame(moveLaserDown);
                    }
                }
            } else {
                if (squares[currentLaserIndex]) {
                    squares[currentLaserIndex].classList.remove("invader-laser");
                }
                cancelAnimationFrame(laserId);
            }
        }
        laserId = requestAnimationFrame(moveLaserDown);
    }
}

continueBtn.addEventListener("click", () => {
    isPaused = false;
    pauseOverlay.style.display = "none";
    requestAnimationFrame(moveInvaders);
    countdownInterval = setInterval(updateCountdown, 1000);
    startInvaderShooting();
});

restartBtn.addEventListener("click", () => {
    location.reload();
});

finalRestartBtn.addEventListener("click", () => {
    location.reload();
});