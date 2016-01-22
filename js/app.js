'use strict';

// ------------------
// Constants
// ------------------

/** Constants that specify dimensions of the enemies, player and collectibles.
 * They are used to implement initial location and movements.
 */
var TITLE_WIDTH = 101,
    TITLE_HEIGHT = 83;


// ------------------
// Enemy pseudo class.
// ------------------

/**
 * Represents an Enemy.
 * @constructor
 */
var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';
    this.loc = [-TITLE_WIDTH, randomizer(3, 1) * TITLE_HEIGHT - 25];
    this.speed = randomizer(3, 1) *100;
};

/**
 * A method that changes the instances locations.
 * It also prevents enemy instances from being gone
 * away from the screen and recicles them.
 *
 * @param {number} dt - Time delta used for smooth animation (see main() in the engine.js).
 */
Enemy.prototype.update = function(dt) {

    if (this.loc[0] < 5 * TITLE_WIDTH) {
        this.loc[0] += this.speed * dt;

    } else {
        this.loc = [-TITLE_WIDTH, randomizer(3, 1) * TITLE_HEIGHT - 25];
        this.speed = randomizer(3, 1) * 100;
    }
};

/**
 * A method to display Enemies (and others) instances
 * and other information like score and timer.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
    ctx.fillStyle = "black";
    ctx.font = "Bold 24px Helvetica";
    ctx.fillText("Score: " + player.score, 300, 35);
    ctx.fillText("Time remain: " + time, 20, 35);
};


// ------------------
// Player pseudo class.
// ------------------

/**
 * Represents a Player.
 *
 * @constructor
 * @param {string} key - The character skin name comes with the playerChoose variable.
 */
var Player = function(key) {
    var character = {
        "Boy": 'images/char-boy.png',
        "Cat Girl": 'images/char-cat-girl.png',
        "Horn Girl": 'images/char-horn-girl.png',
        "Pink Girl": 'images/char-pink-girl.png',
        "Princess": 'images/char-princess-girl.png'
    };

    /**
     * This sets up the default skin when it's not specified.
     */
    if (key !== "Cat Girl" || "Horn Girl" || "Pink Girl" || "Princess") {
        key = "Boy";
    }

    this.sprite = character[key];
    this.loc = [202, 404];

    /**
     * Initial score (the reset() inside the Engine function
     * makes it equals 0 at the begining).
     */
    this.score = -10000;

    /**
     * A method to change Player location.
     *
     * @param {number} x - Alteration ot the first coordinate comes from the this.handleInput().
     * @param {number} y - Alteration ot the second coordinate comes from the this.handleInput().
     */
    this.update = function(x, y) {

        /**
         * This checks out values from a keyboard and handles them.
         */
        if (x !== undefined && y !== undefined) {
            this.loc[0] += x;
            this.loc[1] += y;

        } else return;
    };

    this.render = Enemy.prototype.render;

    /**
     * This method serves to check whether
     * the Player instance went to outside of the playing ground
     * and also handles input from the keyboard.
     *
     * @param {string} key - The Player moving direction data comes from the
     * keyboard event listener.
     */
    this.handleInput = function(key) {
        if (key == "left" && this.loc[0] >= TITLE_WIDTH) {
            this.update(-TITLE_WIDTH, 0);
        }

        if (key == "up" && this.loc[1] >= 50) {
            this.update(0, -TITLE_HEIGHT);
        }

        if (key == "right" && this.loc[0] <= 3 * TITLE_WIDTH) {
            this.update(TITLE_WIDTH, 0);
        }

        if (key == "down" && this.loc[1] <= 330) {
            this.update(0, TITLE_HEIGHT);

        } else {
            this.update(0, 0);
        }
    };
};


// ------------------
// Stuff super pseudo class.
// ------------------

/**
 * Represents any kind of game stuff (except Enemis and Player).
 *
 * @constructor
 * @param {string} img - The image of the stuff.
 */
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

/**
 * This method randomizes locations of the Stuff instances.
 */
Stuff.prototype.locRandomizer = function() {
    var x, y;
    x = randomizer(5, 0) * 101 - 505;
    y = randomizer(3, 1) * 83 - 25;

    return this.loc = [x, y];
};

Stuff.prototype.render = Enemy.prototype.render;


// ------------------
// Gem pseudo class.
// ------------------

/**
 * Represents gems.
 * @constructor
 * @param {number} key - The order number of a gem.
 */
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


// ------------------
// Instances and functions invoking.
// ------------------

var playerChoose = prompt("Wich character do you want to play - Boy, Cat Girl, Horn Girl, Pink Girl or Princess?", "Boy");
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player(playerChoose);
var gems = [new Gem(0), new Gem(1), new Gem(2)];

/**
 * This varable is used by the Enemy.render() to display game timer.
 */
var time;
window.setInterval(timer, 1000);

function timer() {
    time -= 1;
}

/**
 * This immediately-invoked function parses through the array of gems and randomizes
 * their locations such way they don't occupy the same position.
 */
(function gemSpawn () {
    gems.forEach(function(gem) {
        gem.locRandomizer();
    });

    while (gems[0].loc[0] == gems[1].loc[0] ||
        gems[0].loc[0] == gems[2].loc[0] ||
        gems[1].loc[0] == gems[2].loc[0]) {
            gems[1].locRandomizer();
            gems[2].locRandomizer();
        }

        /**
         * And it also instantiates Gem's start locations.
         */
        gems.forEach(function(gem) {
            gem.update();
        });
})();

/**
 * Random value generator.
 */
function randomizer(i, j) {
    return ( Math.floor( Math.random() * i ) + j );
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