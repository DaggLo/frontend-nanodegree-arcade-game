// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.loc = [
            -101,
            function() {
                return ( Math.floor( Math.random() * 3 )  + 1) * 83 - 25;
            }()
        ];
    this.speed = this.speedChanger();
};

Enemy.prototype.speedChanger = function() {
    return (Math.floor( Math.random() * 3 ) + 1) * 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var speed = this.speed;

    if (this.loc[0] < 505) {
	    this.loc[0] += speed * dt;

	} else {
	    this.loc = [
            -101,
            function() {
                return ( Math.floor( Math.random() * 3 )  + 1) * 83 - 25;
            }()
        ];

        this.speed = this.speedChanger();
	};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    this.loc = [202, 404];

    this.update = function(x, y) {
        if (x !== undefined && y !== undefined) {
		    this.loc[0] += x;
            this.loc[1] += y;

		} else return;
    };

    this.render = function() {
	    ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
	};

    this.handleInput = function(key) {
        if (key == "left" && this.loc[0] >= 101) {
            this.update(-101, 0);
        }

        if (key == "up" && this.loc[1] >= 50) {
            this.update(0, -83);
        }

        if (key == "right" && this.loc[0] <= 303) {
            this.update(101, 0);
        }

        if (key == "down" && this.loc[1] <= 330) {
            this.update(0, 83);

        } else {
		    this.update(0, 0);
		}
    };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array(new Enemy(), new Enemy(), new Enemy(), new Enemy());

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// TODO: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection