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

const LEVELS = [
    [
        "                                        ",
        "         SS     FF     WW     RR        ",
        "         SS     FF     WW     RR        ",
        "         SS     FF     WW     RR        ",
        "         SS     FF     WW     RR        ",
        "  P      SS     FF     WW     RR        ", 
        "########################################"],
        [

        ]
];

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
let season = SUMMERCOLORS;

let levelIndex = 0;
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
    
    season = game_findSeasonColors();
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
    game_parseLevel();

    player.collides(floorGroup, () => {
        canJump = true;
    });
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
    game_createEnvironmentSprites();
    game_changeSeason();
}

//*************************************************************************//
// game_parseLevel()
// Parses the level data and creates the environment sprites
// Input: _levelMap (array of strings which represent the level)
// Output: N/A
//*************************************************************************//
function game_parseLevel(_levelMap) {
    let tileWidth = width / LEVELS[levelIndex][0].length;
    let tileHeight = height / LEVELS[levelIndex].length;
    for (let i=0; i < LEVELS[levelIndex].length; i++) {
        for (let j=0; j < LEVELS[levelIndex][i].length; j++) {
            let tileType = LEVELS[levelIndex][i][j];
            let x = tileWidth * j + tileWidth / 2;
            let y = tileHeight * i + tileHeight / 2;
            game_spawnTile(tileType, x, y, tileWidth, tileHeight);
        }
    }
}

//*************************************************************************//
// ggame_spawnTile()
// Spawns a tile based on the tile type
// Input: _tileType (string), _x (x position), _y (y position), _width (width), _height (height)
// Output: N/A
//*************************************************************************//
function game_spawnTile(_tileType, _x, _y, _width, _height) {
    console.log("%cgame_spawnTile() run", "color: blue; background-color: black;");
    switch (_tileType) {
        case 'P':
            game_createPlayerSprite(_x, _y);
            break;
        case '#':
            ground = createSprite(_x, _y, _width + 1, _height + 1, 's');
            ground.rotationLock = true;
            ground.friction = 1;
            floorGroup.add(ground);
            ground.strokeWeight = 0;
            break;
        case 'S':
            let summerObj = new Sprite(_x, _y, _width, _height, 's');
            summerObj.color = season[Math.ceil(random(1, 4))].code;
            summerObj.rotationLock = true;
            summerObj.friction = 0;
            summerObj.strokeWeight = 0;
            onlySummerGroup.add(summerObj);
            break;
        case 'F':
            let fallObj = new Sprite(_x, _y, _width, _height, 's');
            fallObj.color = season[Math.ceil(random(1, 4))].code;
            fallObj.rotationLock = true;
            fallObj.friction = 0;
            fallObj.strokeWeight = 0;
            onlyFallGroup.add(fallObj);
            break;
        case 'W':
            let winterObj = new Sprite(_x, _y, _width, _height, 's');
            winterObj.color = season[Math.ceil(random(1, 3))].code;
            winterObj.rotationLock = true;
            winterObj.friction = 0;
            winterObj.strokeWeight = 0;
            onlyWinterGroup.add(winterObj);
            break;
        case 'R':
            let springObj = new Sprite(_x, _y, _width, _height, 's');
            springObj.color = season[Math.ceil(random(1, 5))].code;
            springObj.rotationLock = true;
            springObj.friction = 0;
            springObj.strokeWeight = 0;
            onlySpringGroup.add(springObj);
            break;
        case 's':
            let excludeSummerObj = new Sprite(_x, _y, _width, _height, 's');
            excludeSummerObj.color = season[Math.ceil(random(1, 4))].code;
            excludeSummerObj.rotationLock = true;
            excludeSummerObj.friction = 0;
            excludeSummerObj.strokeWeight = 0;
            excludeSummerGroup.add(excludeSummerObj);
            break;
        case 'f':
            let excludeFallObj = new Sprite(_x, _y, _width, _height, 's');
            excludeFallObj.color = season[Math.ceil(random(1, 4))].code;
            excludeFallObj.rotationLock = true;
            excludeFallObj.friction = 0;
            excludeFallObj.strokeWeight = 0;
            excludeFallGroup.add(excludeFallObj);
            break;
        case 'w':
            let excludeWinterObj = new Sprite(_x, _y, _width, _height, 's');
            excludeWinterObj.color = season[Math.ceil(random(1, 3))].code;
            excludeWinterObj.rotationLock = true;
            excludeWinterObj.friction = 0;
            excludeWinterObj.strokeWeight = 0;
            excludeWinterGroup.add(excludeWinterObj);
            break;
        case 'r':
            let excludeSpringObj = new Sprite(_x, _y, _width, _height, 's');
            excludeSpringObj.color = season[Math.ceil(random(1, 5))].code;
            excludeSpringObj.rotationLock = true;
            excludeSpringObj.friction = 0;
            excludeSpringObj.strokeWeight = 0;
            excludeSpringGroup.add(excludeSpringObj);
            break;
        default:
            break;
    }
}

//*************************************************************************//
// game_createPlayerSprite()
// Creates the player sprite and sets its properties
// Input: _x, _y (x and y position of the player sprite)
// Output: N/A
//*************************************************************************//
function game_createPlayerSprite(_x, _y) {
    console.log("%cgame_createPlayerSprite() run", "color: blue; background-color: black;");
    player = createSprite(_x, _y, 25, 50, 'd');
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
// game_findSeason()
// Determines the current season and updates the game state accordingly
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_findSeasonColors() {
    switch (currentSeason) {
        case 'Summer': return SUMMERCOLORS;
        case 'Fall': return FALLCOLORS;
        case 'Winter': return WINTERCOLORS;
        case 'Spring': return SPRINGCOLORS;
    }
}

//*************************************************************************//
// game_changeSeason()
// Changes the season based on user input
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_changeSeason() {
    if (kb.pressed('w') || kb.pressed('up')) {
        console.log("Season changed to: " + SEASONS[seasonIndex]);
        seasonIndex += 1;
        if (seasonIndex == SEASONS.length) {
            seasonIndex = 0;
        }
        currentSeason = SEASONS[seasonIndex];
    }
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

    game_updateColors();

    game_displaySeasonalSprites();
}

//*************************************************************************//
// game_updateColors()
// Updates the colors of the sprites based on the current season
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_updateColors() {
    // Update colors of the sprites based on the current season
    for (let i = 0; i < onlySummerGroup.length; i++) {
        onlySummerGroup[i].color = season[Math.ceil(random(1, 4))].code;
    }
    for (let i = 0; i < onlyFallGroup.length; i++) {
        onlyFallGroup[i].color = season[Math.ceil(random(1, 4))].code;
    }
    for (let i = 0; i < onlyWinterGroup.length; i++) {
        onlyWinterGroup[i].color = season[Math.ceil(random(1, 3))].code;
    }
    for (let i = 0; i < onlySpringGroup.length; i++) {
        onlySpringGroup[i].color = season[Math.ceil(random(1, 5))].code;
    }
    for (let i = 0; i < excludeSummerGroup.length; i++) {
        excludeSummerGroup[i].color = season[Math.ceil(random(1, 4))].code;
    }
    for (let i = 0; i < excludeFallGroup.length; i++) {
        excludeFallGroup[i].color = season[Math.ceil(random(1, 4))].code;
    }
    for (let i = 0; i < excludeWinterGroup.length; i++) {
        excludeWinterGroup[i].color = season[Math.ceil(random(1, 3))].code;
    }
    for (let i = 0; i < excludeSpringGroup.length; i++) {
        excludeSpringGroup[i].color = season[Math.ceil(random(1, 5))].code;
    }
    floorGroup.color = season[season.length - 1].code;
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
        _group[i].collider = _visibleCondition ? 'static' : 'none';
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
