# Game Elements
- `Grid`: The game grid is a 20x20 matrix where the game takes place.
- `Shooter`: The player controls a shooter that can move left and right at the bottom of the grid.
- `Invaders`: Aliens that move horizontally across the grid and descend one row when they hit the edge.
- `Lives`: The player starts with 3 lives.
- `Score`: The player's score increases by shooting invaders.
- `Countdown Timer`: The game has a countdown timer of 45 seconds.
- `Overlays`: Various overlays for pause, game over, and start screens.

# Game State Variables
- `Shooter Position`: Tracks the current position of the shooter.
- `Alien Positions`: Tracks the positions of the aliens.
- `Direction`: Indicates the direction of alien movement.
- `Game Speed`: Controls the speed of the game.
- `Pause State`: Indicates whether the game is paused.
- `Player Lives`: Tracks the remaining lives of the player.
- `Score`: Tracks the player's score.
- `Timers and Intervals`: Various timers for countdown, invader movement, and shooting.

# Game Initialization
- `Start Button`: When clicked, initializes the game by hiding the start screen and displaying the game elements.
- `Grid Creation`: Creates the 20x20 grid dynamically.
- `Shooter and Invaders`: Draws the shooter and invaders on the grid.

# Game Mechanics
### Movement
- `Shooter`: Moves left or right based on arrow key inputs.
- `Invaders`: Move horizontally and descend one row when they hit the edge of the grid.
### Shooting
- `Normal Shoot`: The shooter can fire lasers to hit invaders.
- `Special Shoot`: A special shooting mode with a cooldown period.
- `Collision Detection`: Checks for collisions between lasers and invaders, and between invader lasers and the shooter.
- `Score Calculation`: Updates the score based on the time elapsed and invaders hit.
- `Lives Update`: Decreases player lives when hit by invader lasers.
- `Countdown Timer`: Decreases the remaining time and ends the game when time runs out.

# Game Over Conditions
- `Time Up`: The game ends when the countdown timer reaches zero.
- `Invaders Reach Shooter`: The game ends if invaders reach the shooter's row.
- `Player Lives`: The game ends if the player loses all lives.
- `All Invaders Removed`: The player wins if all invaders are removed.

### Event Listeners
- `Keyboard Events`: For shooter movement, shooting, and pausing the game.
- `Button Clicks`: For starting, continuing, and restarting the game.

### Game Overlays
- `Pause Overlay`: Displays when the game is paused.
- `Game Over Overlay`: Displays when the game ends, showing the game over message.