import * as PIXI from 'pixi.js';
import Cat from '../images/cat.png';
import Tileset from '../images/tileset.png';
import treasureHunter from '../images/treasureHunter.json';
import treasureImage from '../images/treasureHunter.png';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

const Application = PIXI.Application,
    Container = PIXI.Container,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle,
    Loader = PIXI.Loader;

//Create a Pixi Application
const app = new Application({
    width: 512, 
    height: 512,                       
    antialiasing: true, 
    backgroundAlpha: 1, 
    resolution: 1
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


const stage = app.stage;

let dungeon, explorer, treasure, door;

const baseTexture = new PIXI.BaseTexture(treasureImage, null, 1)
const spritesheet = new PIXI.Spritesheet(baseTexture, treasureHunter);
spritesheet.parse(setup);


let keyUp, keyDown, keyRight, keyLeft = false;

document.body.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') {
        keyUp = true;
    }
    if (e.code === 'KeyA') {
        keyLeft = true;
    }
    if (e.code === 'KeyS') {
        keyDown = true;
    }
    if (e.code === 'KeyD') {
        keyRight = true;
    }
})
document.body.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') {
        keyUp = false;
    }
    if (e.code === 'KeyA') {
        keyLeft = false;
    }
    if (e.code === 'KeyS') {
        keyDown = false;
    }
    if (e.code === 'KeyD') {
        keyRight = false;
    }
})

function setup(textures) {
    dungeon = new Sprite(textures["dungeon.png"]);
    explorer = new Sprite(textures["explorer.png"]);
    treasure = new Sprite(textures["treasure.png"]);
    stage.addChild(dungeon);

    explorer.x = 68;
    explorer.y = stage.height / 2 - explorer.height / 2;
    stage.addChild(explorer);

    stage.addChild(treasure);
    treasure.x = stage.width - treasure.width - 48;
    treasure.y = stage.height / 2 - treasure.height / 2;
    stage.addChild(treasure);

    door = new Sprite(textures["door.png"]);
    door.position.set(32, 0);

    makeBlobs(textures);
    stage.addChild(door);
    
    explorer.vx = 0;
    explorer.vy = 0;

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    explorer.vx = 1;
    explorer.vy = 1;
    if (keyUp) {
        explorer.y -= explorer.vy;
    }
    if (keyDown) {
        explorer.y += explorer.vy;
    }
    if (keyLeft) {
        explorer.x -= explorer.vx;
    }
    if (keyRight) {
        explorer.x += explorer.vx;
    }
}

function makeBlobs(textures) {
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150;

    for (let i = 0; i < numberOfBlobs; i++) {
        const blob = new Sprite(textures["blob.png"]);

        const x = spacing * i + xOffset;
        const y = randomInt(0, stage.height - blob.height);

        blob.x = x;
        blob.y = y;

        stage.addChild(blob);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
