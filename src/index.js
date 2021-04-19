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
    Loader = PIXI.Loader,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

//Create a Pixi Application
const app = new Application({
    width: 512, 
    height: 512,                       
    antialiasing: true, 
    backgroundAlpha: 1, 
    resolution: 1
});

const message = new Text("Hello world!");

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


const stage = app.stage;

let dungeon, explorer, treasure, door, state, healthBar, explorerHit;
let blobs = [];
let items = new PIXI.Container();
let superFastSprites = new PIXI.ParticleContainer();
const rectangle = new Graphics();
const circle = new Graphics();
const ellipse = new Graphics();
const roundBox = new Graphics();
const line = new Graphics();
const triangle = new Graphics();

const baseTexture = new PIXI.BaseTexture(treasureImage, null, 1)
const spritesheet = new PIXI.Spritesheet(baseTexture, treasureHunter);

let gameScene; let gameOverScene;

spritesheet.parse(setup);



function setup(textures) {
    gameScene = new Container();    
    dungeon = new Sprite(textures['dungeon.png']);
    gameScene.addChild(dungeon);

    door = new Sprite(textures['door.png']);
    door.position.set(32, 0);
    gameScene.addChild(door);

    explorer = new Sprite(textures['explorer.png']);
    explorer.x = 68;
    explorer.y = gameScene.height / 2 - explorer.height / 2;
    explorer.vx = 0;
    explorer.vy = 0;
    gameScene.addChild(explorer);

    treasure = new Sprite(textures['treasure.png']);
    treasure.x = gameScene.width - treasure.width - 48;
    treasure.y = gameScene.height / 2 - treasure.height / 2;
    gameScene.addChild(treasure);

    stage.addChild(gameScene);

    gameOverScene = new Container();
    stage.addChild(gameOverScene)
    gameOverScene.visible = false;

    state = play;

    makeBlobs(textures);
    makeHealthBar();

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state();
}

function moveBlobs() {
    blobs.forEach((blob) => {
        blob.y += blob.vy;

        let blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480});
    
        if (blobHitsWall === "top" || blobHitsWall === "bottom") {
            blob.vy *= -1;
        }
    
        if(hitTestRectangle(explorer, blob)) {
            explorerHit = true;
        }
    });
}

function checkHit() {
if (explorerHit) {
    explorer.alpha = 0.5;
    healthBar.outer.width -= 1;
    } else {
    explorer.alpha = 1;
    }
    explorerHit = false;
}

function drawText() {
    let style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white"
      });
    message = new Text("The End!", style);
    message.x = 120;
    message.y = app.stage.height / 2 - 32;
    gameOverScene.addChild(message);
}

function play(delta) {
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;

    if (hitTestRectangle(explorer, door)) {
        message.text = 'hit';
        rectangle.tint = 0xff3300;
    } else {
        message.text = 'no collision';
        rectangle.tint = 0xccff99;
    }
    contain(explorer, {x: 28, y: 10, width: 488, height: 480});
    moveBlobs();
    checkHit();
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

function makeBlobs(textures) {
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;

    for (let i = 0; i < numberOfBlobs; i++) {
        const blob = new Sprite(textures["blob.png"]);

        const x = spacing * i + xOffset;
        const y = randomInt(0, stage.height - blob.height);

        blob.x = x;
        blob.y = y;

        blob.vy = speed * direction;

        direction *= -1;

        blobs.push(blob);

        gameScene.addChild(blob);
    }
}

function makeHealthBar() {
    healthBar = new Container();
    healthBar.position.set(stage.width - 170, 4);
    gameScene.addChild(healthBar);

    let innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    let outerBar = new Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;  
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

function contain(sprite, container) {

    let collision = undefined;
  
    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }
  
    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }
  
    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }
  
    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }
  
    //Return the `collision` value
    return collision;
  }