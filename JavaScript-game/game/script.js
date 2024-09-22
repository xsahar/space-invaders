const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = [];
let isGoingRight = true;
let direction = 1;
let results = 0;
let lastTime = 0;
const speed = 600;

// Load the images
const invaderImg = new Image();
invaderImg.src = 'images/invader.png'; // Path to your invader image

const shooterImg = new Image();
shooterImg.src = 'images/shooter.png'; // Path to your shooter image

// Create the grid squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

// Initial positions of the alien invaders
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

// Function to draw the invaders
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(alienInvaders[i])) {
            const invaderIndex = alienInvaders[i];
            const invaderSquare = squares[invaderIndex];
            invaderSquare.style.backgroundImage = `url(${invaderImg.src})`;
            invaderSquare.style.backgroundSize = 'cover';
            invaderSquare.style.backgroundRepeat = 'no-repeat';
        }
    }
}

// Function to remove invaders from their current positions
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        const invaderIndex = alienInvaders[i];
        const invaderSquare = squares[invaderIndex];
        invaderSquare.style.backgroundImage = '';
    }
}

// Function to move the shooter
function moveShooter(e) {
    squares[currentShooterIndex].style.backgroundImage = ''; // Remove shooter image from the current position
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].style.backgroundImage = `url(${shooterImg.src})`; // Add shooter image to the new position
    squares[currentShooterIndex].style.backgroundSize = 'cover';
    squares[currentShooterIndex].style.backgroundRepeat = 'no-repeat';
}

document.addEventListener("keydown", moveShooter);

// Initialize the shooter image
squares[currentShooterIndex].style.backgroundImage = `url(${shooterImg.src})`;
squares[currentShooterIndex].style.backgroundSize = 'cover';
squares[currentShooterIndex].style.backgroundRepeat = 'no-repeat';

// Function to move the invaders
function moveInvaders(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed > speed) {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
        remove();

        if (rightEdge && isGoingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width; // Move down
            }
            direction = -1;
            isGoingRight = false;
        }

        if (leftEdge && !isGoingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width; // Move down
            }
            direction = 1;
            isGoingRight = true;
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        }

        draw();

        // Check for game over condition
        if (squares[currentShooterIndex].style.backgroundImage.includes('invader.png')) {
            resultDisplay.innerHTML = "GAME OVER";
            return; // Stop the animation
        }

        lastTime = timestamp;
    }

    requestAnimationFrame(moveInvaders);
}

// Start the animation
requestAnimationFrame(moveInvaders);

// Function to shoot lasers
function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser"); // Remove laser class from the current position
        currentLaserIndex -= width; // Move laser up by one row
        if (currentLaserIndex >= 0) { // Ensure the laser doesn't go out of bounds
            squares[currentLaserIndex].classList.add("laser"); // Add laser class to the new position
        }

        // Check for collision with invader
        if (squares[currentLaserIndex].style.backgroundImage.includes('invader.png')) {
            squares[currentLaserIndex].classList.remove("laser"); // Remove laser class
            squares[currentLaserIndex].style.backgroundImage = ''; // Remove invader image
            squares[currentLaserIndex].classList.add("boom"); // Add boom class

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300); // Remove boom class after 300ms
            cancelAnimationFrame(laserId); // Stop the laser animation

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex); // Get the index of the removed invader
            if (alienRemoved !== -1) {
                aliensRemoved.push(alienInvaders[alienRemoved]); // Add the removed invader to the array
                alienInvaders.splice(alienRemoved, 1); // Remove the invader from the alienInvaders array
            }
            results++; // Increment the score
            resultDisplay.innerHTML = results; // Update the score display

            // Check for win condition
            if (aliensRemoved.length === alienInvaders.length) {
                resultDisplay.innerHTML = "YOU WIN";
                return; // Stop the animation
            }
        } else if (currentLaserIndex < 0) { // Stop the laser if it goes out of bounds
            cancelAnimationFrame(laserId);
        } else {
            laserId = requestAnimationFrame(moveLaser); // Continue moving the laser
        }
    }

    if (e.key === "ArrowUp") {
        laserId = requestAnimationFrame(moveLaser); // Start the laser animation
    }
}

document.addEventListener('keydown', shoot); // Listen for keydown events to shoot lasers
