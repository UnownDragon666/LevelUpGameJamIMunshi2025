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
        "                                      ",
        "                                      ",
        "                                      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "         SS     FF     WW     RR      ",
        "  P      SS     FF     WW     RR      ",
        "########################################"],

    [
        "                         BBB          ",
        "        qqqqqqqqqqq      BBB          ",
        "        FFFFFFFFFFF      BBBqqqqqqqq  ",
        "qqqqq                    BBBrrrrrrrrBB",
        "SSSSS           BB q   q BBB        BB",
        "        qqqqq   BB W q W BBB   q    BB",
        "        RRRRR   BB   W   BBB   W    BB",
        "qqqqq           BB             q    BB",
        "WWWWW           BB             S    BB",
        "        qqqqq   BB q             q  BB",
        "qqqqq   FFFFF   BB R q         q R  BB",
        "SSSSS           BB   r q     q w    BB",
        " P              BB     s     f      BB",
        "qqqqqqqqqqqqqqqqBBqqqqqqqqqqqqqqqqqqBB",
        "#######################################"],
    [
        "########################################################",
        "########################################################",
        "########################################################",
        "                                                        ",
        "                                                        ",
        "                                                       B",
        "                                                       B",
        "                                                       B",
        "                                                       B",
        "    P                                                  B",
        "########################################################",
        "########################################################",
        "########################################################"],
    []
];

const MOVEMENTSPEED = 6.5;
const JUMPSTRENGTH = 10;
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
let seasonGroup;

let levelIndex = 0;
let player;
let ground;
let canJump = true;
let floorGroup, blockGroup, qGroup;
let seasonHasChanged = false;

let leftWall, rightWall;

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
    seasonGroup = new Group();
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
    blockGroup = new Group();
    qGroup = new Group();

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
    game_parseLevel(LEVELS[levelIndex]);

    game_createEnvironmentSprites();
}

//*************************************************************************//
// draw()
// Main game loop that runs continuously
// Provided by P5.js libraries
// Input: N/A
// Output: N/A
//*************************************************************************//
function draw() {
    game_updateSprites();

    season = game_findSeasonColors();
    background(season[0].code);

    game_displaySeason();

    game_changeSeason();

    if (kb.pressed('e')) {
        game_nextLevel();
    }
    if (kb.pressed('r')) {
        game_clearLevel();
        game_parseLevel(LEVELS[levelIndex]);
    }
}

//*************************************************************************//
// game_parseLevel()
// Parses the level data and creates the environment sprites
// Input: _levelMap (array of strings which represent the level)
// Output: N/A
//*************************************************************************//
function game_parseLevel(_levelMap) {
    let tileWidth = width / _levelMap[0].length;
    let tileHeight = height / _levelMap.length;
    for (let i = 0; i < _levelMap.length; i++) {
        for (let j = 0; j < _levelMap[i].length; j++) {
            let tileType = _levelMap[i][j];
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
            game_createPlayerSprite(_x, _y, _width, _height);
            break;
        case '#':
            ground = createSprite(_x, _y, _width + 1, _height + 1, 's');
            ground.rotationLock = true;
            ground.friction = 1;
            floorGroup.add(ground);
            ground.strokeWeight = 0;
            ground.color = season[season.length - 1].code;
            break;
        case 'S':
            let summerObj = new Sprite(_x, _y, _width, _height, 's');
            summerObj.color = random(SUMMERCOLORS.slice(1)).code;
            summerObj.rotationLock = true;
            summerObj.friction = 0;
            summerObj.strokeWeight = 0;
            onlySummerGroup.add(summerObj);
            seasonGroup.add(summerObj);
            break;
        case 'F':
            let fallObj = new Sprite(_x, _y, _width, _height, 's');
            fallObj.color = random(FALLCOLORS.slice(1)).code;
            fallObj.rotationLock = true;
            fallObj.friction = 0;
            fallObj.strokeWeight = 0;
            onlyFallGroup.add(fallObj);
            seasonGroup.add(fallObj);
            break;
        case 'W':
            let winterObj = new Sprite(_x, _y, _width, _height, 's');
            winterObj.color = random(WINTERCOLORS.slice(1)).code;
            winterObj.rotationLock = true;
            winterObj.friction = 0;
            winterObj.strokeWeight = 0;
            onlyWinterGroup.add(winterObj);
            seasonGroup.add(winterObj);
            break;
        case 'R':
            let springObj = new Sprite(_x, _y, _width, _height, 's');
            springObj.color = random(SPRINGCOLORS.slice(1)).code;
            springObj.rotationLock = true;
            springObj.friction = 0;
            springObj.strokeWeight = 0;
            onlySpringGroup.add(springObj);
            seasonGroup.add(springObj);
            break;
        case 's':
            let excludeSummerObj = new Sprite(_x, _y, _width, _height, 's');
            excludeSummerObj.color = random([...FALLCOLORS.slice(1), ...WINTERCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
            excludeSummerObj.rotationLock = true;
            excludeSummerObj.friction = 0;
            excludeSummerObj.strokeWeight = 0;
            excludeSummerGroup.add(excludeSummerObj);
            seasonGroup.add(excludeSummerObj);
            break;
        case 'f':
            let excludeFallObj = new Sprite(_x, _y, _width, _height, 's');
            excludeFallObj.color = random([...SUMMERCOLORS.slice(1), ...WINTERCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
            excludeFallObj.rotationLock = true;
            excludeFallObj.friction = 0;
            excludeFallObj.strokeWeight = 0;
            excludeFallGroup.add(excludeFallObj);
            seasonGroup.add(excludeFallObj);
            break;
        case 'w':
            let excludeWinterObj = new Sprite(_x, _y, _width, _height, 's');
            excludeWinterObj.color = random([...SUMMERCOLORS.slice(1), ...FALLCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
            excludeWinterObj.rotationLock = true;
            excludeWinterObj.friction = 0;
            excludeWinterObj.strokeWeight = 0;
            excludeWinterGroup.add(excludeWinterObj);
            seasonGroup.add(excludeWinterObj);
            break;
        case 'r':
            let excludeSpringObj = new Sprite(_x, _y, _width, _height, 's');
            excludeSpringObj.color = random([...SUMMERCOLORS.slice(1), ...FALLCOLORS.slice(1), ...WINTERCOLORS.slice(1)]).code;
            excludeSpringObj.rotationLock = true;
            excludeSpringObj.friction = 0;
            excludeSpringObj.strokeWeight = 0;
            excludeSpringGroup.add(excludeSpringObj);
            seasonGroup.add(excludeSpringObj);
            break;
        case 'B':
            let blockObj = new Sprite(_x, _y, _width, _height, 's');
            blockObj.color = season[season.length - 1].code;
            blockObj.rotationLock = true;
            blockObj.friction = 0;
            blockObj.strokeWeight = 0;
            blockGroup.add(blockObj);
            break;
        case 'q':
            let qObj = new Sprite(_x, _y - _height / 2, _width, 2, 'n');
            qObj.visible = false;
            qObj.rotationLock = true;
            qObj.friction = 0;
            qObj.strokeWeight = 0;
            qGroup.add(qObj);
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
function game_createPlayerSprite(_x, _y, _width, _height) {
    console.log("%cgame_createPlayerSprite() run", "color: blue; background-color: black;");
    _pwidth = _width / 2;
    _pheight = _height;
    player = createSprite(_x, _y, _pwidth, _pheight, 'd');
    player.rotationLock = true;
    player.color = 'white';
    player.friction = 0;
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
        game_updateColors();
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
    game_displaySeasonalSprites();

    player.collides(rightWall, game_nextLevel);
    player.collides(floorGroup, () => {
        canJump = true;
    });
    player.colliding(floorGroup, () => {
        console.log("Player is colliding with floor group");
        canJump = true;
    });
    player.overlapping(qGroup, () => {
        setTimeout(() => {
            if (player.vel.y == 0) {
                canJump = true;
            }
        }, 300);
    });
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
        onlySummerGroup[i].color = random(SUMMERCOLORS.slice(1)).code;
    }
    for (let i = 0; i < onlyFallGroup.length; i++) {
        onlyFallGroup[i].color = random(FALLCOLORS.slice(1)).code;
    }
    for (let i = 0; i < onlyWinterGroup.length; i++) {
        onlyWinterGroup[i].color = random(WINTERCOLORS.slice(1)).code;
    }
    for (let i = 0; i < onlySpringGroup.length; i++) {
        onlySpringGroup[i].color = random(SPRINGCOLORS.slice(1)).code;
    }
    for (let i = 0; i < excludeSummerGroup.length; i++) {
        excludeSummerGroup[i].color = random([...FALLCOLORS.slice(1), ...WINTERCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
    }
    for (let i = 0; i < excludeFallGroup.length; i++) {
        excludeFallGroup[i].color = random([...SUMMERCOLORS.slice(1), ...WINTERCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
    }
    for (let i = 0; i < excludeWinterGroup.length; i++) {
        excludeWinterGroup[i].color = random([...SUMMERCOLORS.slice(1), ...FALLCOLORS.slice(1), ...SPRINGCOLORS.slice(1)]).code;
    }
    for (let i = 0; i < excludeSpringGroup.length; i++) {
        excludeSpringGroup[i].color = random([...SUMMERCOLORS.slice(1), ...FALLCOLORS.slice(1), ...WINTERCOLORS.slice(1)]).code;
    }
    floorGroup.color = season[season.length - 1].code;
    blockGroup.color = season[season.length - 1].code;
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
            player.vel.y = -1 * JUMPSTRENGTH;
            canJump = false;
        }
    }
}

//*************************************************************************//
// game_nextLevel()
// Loads the next level in the game
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_nextLevel() {
    levelIndex += 1;
    if (levelIndex == LEVELS.length) {
        gameEnd();
        return;
    }
    game_clearLevel();
    game_parseLevel(LEVELS[levelIndex]);
}

//*************************************************************************//
// game_clearLevel()
// Clears the current level and resets the game state
// Input: N/A
// Output: N/A
//*************************************************************************//
function game_clearLevel() {
    onlySummerGroup.removeAll();
    onlyFallGroup.removeAll();
    onlyWinterGroup.removeAll();
    onlySpringGroup.removeAll();
    excludeSummerGroup.removeAll();
    excludeFallGroup.removeAll();
    excludeWinterGroup.removeAll();
    excludeSpringGroup.removeAll();
    qGroup.removeAll();
    blockGroup.removeAll();
    floorGroup.removeAll();
    player.remove();
}

//*************************************************************************//
// END OF FILE
//
//
//*************************************************************************//