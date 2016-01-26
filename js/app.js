'use strict';

// ------------------
// Constants.
// ------------------

/**
 * Constants that specify dimensions of the enemies, player and collectibles.
 * They are used to implement initial locations and movements.
 */
var TITLE_WIDTH = 101,
    TITLE_HEIGHT = 83,
    CHARACTERS_IMAGES = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ],
    STUFF_IMAGES = {
        'blue gem': 'images/gem-blue.png',
        'green gem': 'images/gem-green.png',
        'orange gem': 'images/gem-orange.png',
        'heart': 'images/Heart.png',
        'key': 'images/Key.png',
        'star': 'images/Star.png',
        'rock': 'images/Rock.png',
        'selector': 'images/Selector.png'
    },
    NUMBER_OF_ENEMIES = 4,
    NUMBER_OF_GEMS = 3;


// ------------------
// Common functions and global variables.
// ------------------

/**
 * This varable is used by the Enemy.render() to display game timer.
 */
var allEnemies,
    gems,
    player,
    playerChoose,
    time;

playerChoose = prompt('Wich character do you want to play - ' +
    'Boy, Cat Girl, Horn Girl, Pink Girl or Princess?', 'Boy');

allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

player = new Player(playerChoose);

gems = (function(i) {
    var arr = [];

    for (var j = 0; j < i; j++) {
        arr.push(new Gem(j));
    }



    return arr;

})(NUMBER_OF_GEMS);

function timer() {
    time -= 1;
}

/**
 * This function is called by the reset() function of the Engine.js,
 * parses through the array of gems and randomizes their locations
 * such way they don't occupy the same position.
 */
function gemSpawn() {
    gems.forEach(function(gem) {
        gem.init();
    });

    while (gems[0].loc[0] == gems[1].loc[0] ||
        gems[0].loc[0] == gems[2].loc[0] ||
        gems[1].loc[0] == gems[2].loc[0]) {
            gems[1].init();
            gems[2].init();
        }

    /**
     * And it also instantiates Gem's start locations.
     */
    gems.forEach(function(gem) {
        gem.update();
    });
}

/**
 *
 */
function startScreen() {
    ctx.clearRect(0, 0, 505, 606);

    ctx.font = '36px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(Resources.get('images/enemy-bug.png'), 292, -5);
    ctx.globalAlpha = 1;
    ctx.fillText('Ladybugger', 505 / 2, 110);
    ctx.font = '18px monospace';
    ctx.fillText('[<] select your hero [>]', 505 / 2, 300);
    ctx.font = '14px monospace';
    ctx.fillText('hit [space] to start', 505 / 2, 550);
    ctx.textAlign = 'left';

    CHARACTERS_IMAGES.forEach(function(char,i) {
        ctx.drawImage(Resources.get(char), TITLE_WIDTH * i, 300);
    });
    ctx.drawImage(Resources.get(STUFF_IMAGES[selector]), TITLE_WIDTH * this.selected, 360);
}

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
Stuff.prototype.init = function() {
    var x, y;
    x = randomizer(5, 0) * TITLE_WIDTH - 505;
    y = randomizer(3, 1) * TITLE_HEIGHT - 25;

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
    this.init();
};

Gem.prototype = Object.create(Stuff.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function() {
    this.loc[0] += 505;
};


// ------------------
// Instances and functions invoking.
// ------------------



window.setInterval(timer, 1000);