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
STUFF_IMAGES = {
  'gems': [
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png'
  ],
  'characters': [
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-boy.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ],
  'heart': 'images/Heart.png',
  'key': 'images/Key.png',
  'star': 'images/Star.png',
  'rock': 'images/Rock.png',
  'selector': 'images/Selector.png',
  'bug': 'images/enemy-bug.png'
},
OPTIONS = {
  'NUMBER_OF_ENEMIES' = 4,
  'NUMBER_OF_GEMS' = 3,
  'ENEMY_MAX_SPEED' = 3
};


// ------------------
// Global variables.
// ------------------

var allEnemies,
gameReadiness = false,
gems,
input,
player,
selectedCharacter = 2,
time;


// ------------------
// Stuff super pseudo class.
// ------------------

/**
 * Represents everything (means Enemies, Player, Gems etc.).
 *
 * @constructor
 * @param {string} img - A property name of the STUFF_IMAGES.
 * @param {number} num - If a property is an object - the number of it's property.
 */
var Stuff = function(img, num) {
  if (typeof STUFF_IMAGES[img] = 'string') {
    this.sprite = STUFF_IMAGES[img];

  } else {
    this.sprite = STUFF_IMAGES[img][num];
  }
};

/**
 * This method randomizes locations of the Stuff instances.
 */
/* Stuff.prototype.init = function() {
  var x, y;
  x = randomizer(5, 0) * TITLE_WIDTH - 505;
  y = randomizer(3, 1) * TITLE_HEIGHT - 25;

  return this.loc = [x, y];
}; */


/**
 * A method to display Stuff instances
 * and other information like score and timer.
 */
Stuff.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.loc[0], this.loc[1]);
  ctx.fillStyle = "black";
  ctx.font = "Bold 24px Helvetica";
  ctx.fillText("Score: " + player.score, 300, 35);
  ctx.fillText("Time remain: " + time, 20, 35);
};


// ------------------
// Enemy pseudo class.
// ------------------

/**
 * Represents an Enemy.
 * @constructor
 */
var Enemy = function() {
  Stuff.call(this, 'bug');

  this.loc = [-TITLE_WIDTH, randomizer(3, 1) * TITLE_HEIGHT - 25];
  this.speed = randomizer(3, 1) * 100;
};

Enemy.prototype = Object.create(Stuff.prototype);
Enemy.prototype.constructor = Enemy;

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
  Stuff.call(this, 'character', key);
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
// Gem pseudo class.
// ------------------

/**
 * Represents gems.
 * @constructor
 * @param {number} key - The order number of a gem.
 */
var Gem = function(key) {
  if (key >= NUMBER_OF_GEMS) {
    key = randomizer(NUMBER_OF_GEMS, 0);
  }

  Stuff.call(this, 'gems', key);
  this.points = (key + 1) * 2000;

  this.init();
  x = randomizer(5, 0) * TITLE_WIDTH - 505;
  y = randomizer(3, 1) * TITLE_HEIGHT - 25;
};

Gem.prototype = Object.create(Stuff.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function() {
  this.loc[0] += 505;
};

// ------------------
// Instances and functions invoking.
// ------------------

allEnemies = (function() {
  var enemiesArr = [];

  for (var i = 0; i < NUMBER_OF_ENEMIES; i++) {
    enemiesArr.push(new Enemy());
  }

  return enemiesArr;
})();

gems = (function() {
  var gemsArr = [];

  for (var i = 0; i < NUMBER_OF_GEMS; i++) {
    gemsArr.push(new Gem(i));

    if (i > 0) {
      stuffRelocator(gemsArr[i], i, gemsArr);
    } else continue;
  }

  return gemsArr;
})();

window.setInterval(timer, 1000);

// ------------------
// Common functions.
// ------------------

function timer() {
  time -= 1;
}

/**
 * Random value generator.
 */
function randomizer(i, j) {
  return (Math.floor(Math.random() * i) + j);
}

/**
 * This function is called by the reset() function of the Engine.js,
 * parses through the array of gems and randomizes their locations
 * such way they don't occupy the same position.
 */
function stuffRelocator(item, i, arr) {

  for (var j = 0; j < i; j++) {

    for (;;) {
      if (arr[j].loc[0] == item.loc[0]) {

        if (arr[j].loc[1] == item.loc[1]) {
          item.init();

        } else break;
      } else break;
    }
  }

/**
 * And it also instantiates Gem's start locations.
 */
// gems.forEach(function(gem) {
//     gem.update();
// });
}

/**
 *
 */
function startScreen() {
  // if (!gameReadiness) {

  var render = (function () {
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

    ctx.drawImage(Resources.get(STUFF_IMAGES['selector']), TITLE_WIDTH * selectedCharacter, 360);
  })();

  var handleInput = (function () {
    if (input == "left" && selectedCharacter > 0) {
      selectedCharacter--;
      input = null;
    }

    if (input == "right" && selectedCharacter < 4) {
      selectedCharacter++;
      input = null;
    }

    if (input == "space") {
      player = new Player(selectedCharacter);
      input = null;
      gameReadiness = true;
    }
  })();

    // window.requestAnimationFrame(startScreen);
// }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  if (gameReadiness) {
    player.handleInput(allowedKeys[e.keyCode]);

  } else {
    input = allowedKeys[e.keyCode];
  }
});