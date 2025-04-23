//*************************************************************************//
// game_playScript.js
// Written by: Idrees Munshi
// Game logic script
//
//*************************************************************************//
console.log("%cgame_playScript.js loaded", "color: red; background-color: black;");

//*************************************************************************//
// Constants
//
//*************************************************************************//
const SUMMERCOLORS = [
    { name: 'skyBlue', code: '#7BDFF2' },
    { name: 'orange', code: '#D76A03' },
    { name: 'red', code: '#BF3100' },
    { name: 'lightOrange', code: '#EC9F05' },
    { name: 'yellow', code: '#F5BB00' },
    { name: 'green', code: '#8EA604' }
];
const FALLCOLORS = [
    { name: 'lightBrown', code: '#FBBA72' },
    { name: 'brown1', code: '#CA5310' },
    { name: 'brown2', code: '#BB4D00' },
    { name: 'mahogany', code: '#8F250C' },
    { name: 'darkBrown', code: '#691E06' },
    { name: 'red', code: '#d62828' }
];
const WINTERCOLORS = [
    { name: 'lightBlue', code: '#CAF0F8' },
    { name: 'lightBlue2', code: '#90E0EF' },
    { name: 'blue1', code: '#00B4D8' },
    { name: 'blue2', code: '#0077B6' },
    { name: 'darkBlue', code: '#03045E' }
];
const SPRINGCOLORS = [
    { name: 'skyBlue', code: '#7bdff2' },
    { name: 'parchment', code: '#F0EAD2' },
    { name: 'lightPink', code: '#FEC5BB' },
    { name: 'lightGreen', code: '#DDE5B6' },
    { name: 'lightBrown', code: '#A98467' },
    { name: 'brown', code: '#6C584C' },
    { name: 'pastelOlive', code: '#ADC178' }
];
const SEASONS = ['Summer', 'Fall', 'Winter', 'Spring'];

const MOVEMENTSPEED = 6.5;
const GRAVITY = 15;

//*************************************************************************//
// Variables
//
//*************************************************************************//
let onlySummerGroup;
let onlyFallGroup;
let onlyWinterGroup;
let onlySpringGroup;
let excludeSummerGroup;
let excludeFallGroup;
let excludeWinterGroup;
let excludeSpringGroup;
let seasonIndex = 0;
let currentSeason = SEASONS[seasonIndex];
let season;

let level = 1;
let player;
let ground;
let canJump = true;
let floorGroup;
let seasonHasChanged = false;

//*************************************************************************//
// preload()
// Preloads all assets for the game
// Provided by P5.js libraries
// Input: N/A
// Output: N/A
//*************************************************************************//
function preload() {
    console.log("%cpreload() run", "color: blue; background-color: black;");

    // Create groups for seasonal sprites
    onlySummerGroup = new Group();
    onlyFallGroup = new Group();
    onlyWinterGroup = new Group();
    onlySpringGroup = new Group();
    excludeSummerGroup = new Group();
    excludeFallGroup = new Group();
    excludeWinterGroup = new Group();
    excludeSpringGroup = new Group();

    // Create group for environment sprites
    floorGroup = new Group();
}

//*************************************************************************//
// setup()
// Sets up the game environment and initializes variables
// Provided by P5.js libraries
// Input: N/A   
// Output: N/A
//*************************************************************************//
function setup() {
    console.log("%csetup() run", "color: blue; background-color: black;");
    let cnv = createCanvas(windowWidth, windowHeight);

    world.gravity.y = GRAVITY;

    game_createPlayerSprite();
    game_createEnvironmentSprites();

    player.collides(floorGroup, () => {
        canJump = true;
    });

    game_createSeasonalSprites();
}

//*************************************************************************//
// draw()
// Main game loop that runs continuously
// Provided by P5.js libraries
// Input: N/A
// Output: N/A
//*************************************************************************//
function draw() {
    season = game_findSeasonColors();
    background(season[0].code);
    game_updateSprites();
    game_displaySeason();
    game_changeSeason();
}

//*************************************************************************//
// game_createPlayerSprite()
// Creates the player sprite and sets its properties
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_createPlayerSprite() {
    console.log("%cgame_createPlayerSprite() run", "color: blue; background-color: black;");
    player = createSprite(width / 10 + 25, height * (9 / 10), 25, 50, 'd');
    player.rotationLock = true;
    player.color = 'white';
}



//*************************************************************************//
// game_createEnvironmentSprites()
// Creates the environment sprites and sets their properties
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_createEnvironmentSprites() {
    console.log("%cgame_createEnvironmentSprites() run", "color: blue; background-color: black;");
    ground = createSprite(width / 2, height - 25, 2 * width, 50, 's');
    ground.friction = 0.75;
    floorGroup.add(ground);


    leftWall = createSprite(0, height / 2, 5, height, 's');
    leftWall.rotationLock = true;
    leftWall.color = 'black';
    leftWall.friction = 0;

    rightWall = createSprite(width + 25, height / 2, 5, height, 's');
    rightWall.rotationLock = true;
    rightWall.color = 'black';
    rightWall.friction = 0;

}

//*************************************************************************//
// game_createSeasonalSprites()
// Creates the seasonal sprites and sets their properties
// Input: N/A   
// Output: N/A
//*************************************************************************//
function game_createSeasonalSprites() {
    game_createOnlySummerSprites();
    game_createOnlyFallSprites();
    game_createOnlyWinterSprites();
    game_createOnlySpringSprites();

    game_createExcludeSummerSprites();
    game_createExcludeFallSprites();
    game_createExcludeWinterSprites();
    game_createExcludeSpringSprites();
}

//*************************************************************************//
// game sprite creation functions
// These functions create the seasonal sprites and set their properties
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_createOnlySummerSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'red';
    obj.rotationLock = true;
    obj.friction = 0;
    onlySummerGroup.add(obj);
}

function game_createOnlyFallSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'orange';
    obj.rotationLock = true;
    obj.friction = 0;
    onlyFallGroup.add(obj);
}

function game_createOnlyWinterSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'blue';
    obj.rotationLock = true;
    obj.friction = 0;
    onlyWinterGroup.add(obj);
}

function game_createOnlySpringSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'green';
    obj.rotationLock = true;
    obj.friction = 0;
    onlySpringGroup.add(obj);
}

function game_createExcludeSummerSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'purple';
    obj.rotationLock = true;
    obj.friction = 0;
    excludeSummerGroup.add(obj);
}

function game_createExcludeFallSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'pink';
    obj.rotationLock = true;
    obj.friction = 0;
    excludeFallGroup.add(obj);
}

function game_createExcludeWinterSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'cyan';
    obj.rotationLock = true;
    obj.friction = 0;
    excludeWinterGroup.add(obj);
}

function game_createExcludeSpringSprites() {
    let obj = new Sprite(random(width / 2 - 100, width / 2 + 100), height / 2, 10, 10, 's');
    obj.color = 'yellow';
    obj.rotationLock = true;
    obj.friction = 0;
    excludeSpringGroup.add(obj);
}


//*************************************************************************//
// game_findSeason()
// Determines the current season and updates the game state accordingly
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_findSeasonColors() {
    if (currentSeason == 'Summer') {
        return SUMMERCOLORS;
    } else if (currentSeason == 'Fall') {
        return FALLCOLORS;
    } else if (currentSeason == 'Winter') {
        return WINTERCOLORS;
    } else if (currentSeason == 'Spring') {
        return SPRINGCOLORS;
    };
}

//*************************************************************************//
// game_changeSeason()
// Changes the season based on user input
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_changeSeason() {
    // Hold down 'h' for 2 seconds to change season
    let timer;
    let isKeyPressed = false;

    document.addEventListener('keydown', (event) => {
        if (event.key == 'w' || event.key == 'ArrowUp' && !isKeyPressed) {
            isKeyPressed = true;
            timer = setTimeout(() => {
                if (!seasonHasChanged) {
                    seasonHasChanged = true;
                    console.log("Season changed to: " + SEASONS[seasonIndex]);
                    seasonIndex += 1;
                    if (seasonIndex == SEASONS.length) {
                        seasonIndex = 0;
                    }
                    currentSeason = SEASONS[seasonIndex];
                }
            }, 300);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key == 'w' || event.key == 'ArrowUp') {
            clearTimeout(timer);
            isKeyPressed = false;
            seasonHasChanged = false;
        }
    });
}

//*************************************************************************//
// game_displaySeason()
// Displays the current season on the screen
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_displaySeason() {
    fill('black');
    textSize(32);
    textAlign(CENTER);
    textFont('Quicksand');
    text("Current Season: " + currentSeason, width / 2, 40);
}

//*************************************************************************//
// game_updateSprites()
// Updates the sprites in the game based on current season and user input
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_updateSprites() {
    game_movePlayer();

    ground.color = season[season.length - 1].code;

    game_displaySeasonalSprites();
}

//*************************************************************************//
// game_displaySeasonalSprites()
// Displays the seasonal sprites based on the current season
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_displaySeasonalSprites() {
    toggleGroupVisibility(onlySummerGroup, currentSeason === 'Summer');
    toggleGroupVisibility(onlyFallGroup, currentSeason === 'Fall');
    toggleGroupVisibility(onlyWinterGroup, currentSeason === 'Winter');
    toggleGroupVisibility(onlySpringGroup, currentSeason === 'Spring');

    toggleGroupVisibility(excludeSummerGroup, currentSeason !== 'Summer');
    toggleGroupVisibility(excludeFallGroup, currentSeason !== 'Fall');
    toggleGroupVisibility(excludeWinterGroup, currentSeason !== 'Winter');
    toggleGroupVisibility(excludeSpringGroup, currentSeason !== 'Spring');
}

//*************************************************************************//
// toggleGroupVisibility()
// Toggles the visibility of a group of sprites based on a condition
// Input: _group (Group), _visibleCondition (condition)
// Output: N/A
//*************************************************************************//
function toggleGroupVisibility(_group, _visibleCondition) {
    for (let i = 0; i < _group.length; i++) {
        _group[i].visible = _visibleCondition;
        _group[i].collider = _visibleCondition ? 'dynamic' : 'none';
    }
}

//*************************************************************************//
// game_movePlayer()
// Moves the player sprite based on user input
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_movePlayer() {
    let canMove = true;

    if (kb.pressing('a') || kb.pressing('left')) {
        if (canMove == true) {
            player.vel.x = -1 * MOVEMENTSPEED;
            canMove = false;
        }
    }

    if (kb.pressing('d') || kb.pressing('right')) {
        if (canMove == true) {
            player.vel.x = MOVEMENTSPEED;
            canMove = false;
        } else {
            player.vel.x = 0;
        }
    }

    // Stop player movement when key released
    if (kb.released('a') || kb.released('d') || kb.released('left') || kb.released('right')) {
        player.vel.x = 0;
    }

    if (kb.pressing('space')) {
        if (canJump == true) {
            player.vel.y = -1 * MOVEMENTSPEED;
            canJump = false;
        }
    }
}

// When button is pressed to start game, or between levels, have a screen which shows messages like:
// "Remember, your life is precious. Don't waste it."