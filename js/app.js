// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.loc = [-101, randomizer(3, 1) * 83 - 25];
    this.speed = randomizer(3, 1) *100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //var speed = this.speed;

    if (this.loc[0] < 505) {
	    this.loc[0] += this.speed * dt;

	} else {
	    this.loc = [-101, randomizer(3, 1) * 83 - 25];
        this.speed = randomizer(3, 1) * 100;
	};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
	ctx.fillStyle = "black";
	ctx.font = "Bold 24px Helvetica";
    ctx.fillText("Score: " + player.score, 300, 35);
	ctx.fillText("Time remain: " + time, 20, 35);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(key) {
    character = {
	    "Boy": 'images/char-boy.png',
		"Cat Girl": 'images/char-cat-girl.png',
		"Horn Girl": 'images/char-horn-girl.png',
		"Pink Girl": 'images/char-pink-girl.png',
		"Princess": 'images/char-princess-girl.png'
	};
	
	if (key === null) {
	    key = "Boy";
	}
	
	this.sprite = character[key];
    this.loc = [202, 404];
	this.score = -10000;

    this.update = function(x, y) {
        if (x !== undefined && y !== undefined) {
		    this.loc[0] += x;
            this.loc[1] += y;

		} else return;
    };

    this.render = Enemy.prototype.render;

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

var Stuff = function(img) {
    var image = [
	    'images/gem-blue.png',
	    'images/gem-green.png',
		'images/gem-orange.png',
		'images/Heart.png',
		'images/Key.png',
		'images/Star.png',
		'images/Rock.png'
	];
	
	this.sprite = image[img];
};

Stuff.prototype.locRandomizer = function() {
    var x, y;
    x = randomizer(5, 0) * 101 - 505;
    y = randomizer(3, 1) * 83 - 25;
	
	return this.loc = [x, y];
};

Stuff.prototype.render = Enemy.prototype.render;
    /* console.log(this.sprite, this.loc[0], this.loc[1]); */
    /* ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]); */

	
var Gem = function(key) {
    Stuff.call(this, key);
	this.points = (key + 1) * 2000;
	this.locRandomizer();
};

Gem.prototype = Object.create(Stuff.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function() {
    this.loc[0] += 505;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var playerChoose = prompt("Wich character do you want to play - Boy, Cat Girl, Horn Girl, Pink Girl or Princess?", "Boy");

var allEnemies = new Array(new Enemy(), new Enemy(), new Enemy(), new Enemy());

var player = new Player(playerChoose);

var gems = new Array(new Gem(0), new Gem(1), new Gem(2));

var time;
gemSpawn();
window.setInterval(timer, 1000);
console.log(time);

function gemSpawn () {
    gems.forEach(function(gem) {
			gem.locRandomizer();
		});
		
    while (gems[0].loc[0] == gems[1].loc[0] || gems[0].loc[0] == gems[2].loc[0] || gems[1].loc[0] == gems[2].loc[0]) {
		    gems[1].locRandomizer();
			gems[2].locRandomizer();
		}
		
		gems.forEach(function(gem) {
			gem.update();
		});
};

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

function randomizer(i, j) {
    return ( Math.floor( Math.random() * i ) + j );
}

function timer() {	
	time -= 1;
}