// -------------------
// Enemy class.
// -------------------
var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';          // Enemy image.
    this.loc = [-101, randomizer(3, 1) * 83 - 25]; // Enemy location.
    this.speed = randomizer(3, 1) *100;            // Enemy speed.
};

// -------------------
// Enemy prototype.
// -------------------
Enemy.prototype.update = function(dt) {            // Update.method() to change instances locations.

    if (this.loc[0] < 505) {                       // This checks that enemy instances don't go away
	    this.loc[0] += this.speed * dt;            // from the screen.

	} else {
	    this.loc = [-101, randomizer(3, 1) * 83 - 25];
        this.speed = randomizer(3, 1) * 100;
	};
};

Enemy.prototype.render = function() {              // Render.method() to display Enemy (and others) instances
    ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
	ctx.fillStyle = "black";                       // and other information like score and timer.
	ctx.font = "Bold 24px Helvetica";
    ctx.fillText("Score: " + player.score, 300, 35);
	ctx.fillText("Time remain: " + time, 20, 35);
};

// ------------------
// Player class.
// ------------------
var Player = function(key) {
    character = {                                  // This an array of the eventual player skins,
	    "Boy": 'images/char-boy.png',              // that user can change at the begining or when restart.
		"Cat Girl": 'images/char-cat-girl.png',
		"Horn Girl": 'images/char-horn-girl.png',
		"Pink Girl": 'images/char-pink-girl.png',
		"Princess": 'images/char-princess-girl.png'
	};

	if (key === null) {                            // This setup the default skin when user clicks "cancel".
	    key = "Boy";
	}

	this.sprite = character[key];                  // Player skin.
    this.loc = [202, 404];                         // Player initial location.
	this.score = -10000;                           // Initial score (the reset() function makes it equal 0 at the begining).

    this.update = function(x, y) {                 // Player update.method().
        if (x !== undefined && y !== undefined) {  // This checks out values from the keyboard and handle them.
		    this.loc[0] += x;
            this.loc[1] += y;

		} else return;
    };

    this.render = Enemy.prototype.render;          // Player render.method() to dsplay plyer instance.

    this.handleInput = function(key) {             // Player handleInput.method(). This serves to check whether
        if (key == "left" && this.loc[0] >= 101) { // the Player instance went tj the outside of the playing ground
            this.update(-101, 0);                  // and also handles input from the keyboard.
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

// ------------------
// Stuff Superclass.
// ------------------
var Stuff = function(img) {                        // The Stuff class.
    var image = [                                  // Image.array for the every stuff.
	    'images/gem-blue.png',
	    'images/gem-green.png',
		'images/gem-orange.png',
		'images/Heart.png',
		'images/Key.png',
		'images/Star.png',
		'images/Rock.png'
	];

	this.sprite = image[img];                      // Property to store the image.
};

// ------------------
// Stuff Superclass Prototype.
// ------------------
Stuff.prototype.locRandomizer = function() {       // locRandomizer.method() for the Stuff instances
    var x, y;                                      // to "randomize' their locations.
    x = randomizer(5, 0) * 101 - 505;
    y = randomizer(3, 1) * 83 - 25;

	return this.loc = [x, y];
};

Stuff.prototype.render = Enemy.prototype.render;   // Render.method().

// ------------------
// Gem class.
// ------------------
var Gem = function(key) {                          // Gem class. To instance gems.
    Stuff.call(this, key);                         // Calling the Stuff superclass function with the parametr
	this.points = (key + 1) * 2000;                // 'this' provided. Property for points.
	this.locRandomizer();                          // Initial location.
};

Gem.prototype = Object.create(Stuff.prototype);    // Chaining the Stuff.prototype.
Gem.prototype.constructor = Gem;                   // Redefining the constructor.
Gem.prototype.update = function() {                // Update.method().
    this.loc[0] += 505;
};

// ------------------
// Instances and functions invoking.
// ------------------
var playerChoose = prompt("Wich character
    do you want to play - Boy, Cat Girl,
    Horn Girl, Pink Girl or Princess?", "Boy");    // Asking user for the character choosing.

var allEnemies = new Array(new Enemy(),            // An array of Enemy instances.
    new Enemy(), new Enemy(), new Enemy());

var player = new Player(playerChoose);             // Player instance.

var gems = new Array(new Gem(0),                   // Array with the Gem instances.
    new Gem(1), new Gem(2));

var time;                                          // Global variable "time". To be accessible from the render.method().
gemSpawn();                                        // Invoking of the gemSpawn.
window.setInterval(timer, 1000);                   // Cyclical invoking of the timer function.

function gemSpawn () {                             // This function parses through the array of gems and randomize
    gems.forEach(function(gem) {                   // their locations such way they don't occupy the same position.
			gem.locRandomizer();
		});

    while (gems[0].loc[0] == gems[1].loc[0] ||
        gems[0].loc[0] == gems[2].loc[0] ||
        gems[1].loc[0] == gems[2].loc[0]) {
		    gems[1].locRandomizer();
			gems[2].locRandomizer();
		}

		gems.forEach(function(gem) {               // And also it instantiates Gem's start locations.
			gem.update();
		});
}

function randomizer(i, j) {
    return ( Math.floor( Math.random() * i ) + j );// Random value generator.
}

function timer() {
    time -= 1;                                     // Timer function for the in-game timer.
}

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