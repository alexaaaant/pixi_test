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

let dungeon, explorer, treasure, door, state;

const baseTexture = new PIXI.BaseTexture(treasureImage, null, 1)
const spritesheet = new PIXI.Spritesheet(baseTexture, treasureHunter);
spritesheet.parse(setup);

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

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}


function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;
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

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
}

let down = keyboard('ArrowDown');
let up = keyboard('ArrowUp');
let left = keyboard('ArrowLeft');
let right = keyboard('ArrowRight');

left.press = () => {
    explorer.vx = -5;
    explorer.vy = 0;
}

left.release = () => {
    if (!right.isDown && explorer.vy === 0) {
        explorer.vx = 0;
    }
}

up.press = () => {
    explorer.vy = -5;
    explorer.vx = 0;
}
up.release = () => {
    if (!down.isDown && explorer.vx === 0) {
        explorer.vy = 0;
    }
}

right.press = () => {
    explorer.vx = 5;
    explorer.vy = 0;
}
right.release = () => {
    if (!left.isDown && explorer.vy === 0) {
        explorer.vx = 0;
    }
}

down.press = () => {
    explorer.vy = 5;
    explorer.vx = 0;
  };
  
down.release = () => {
    if (!up.isDown && explorer.vx === 0) {
        explorer.vy = 0;
    }
};
