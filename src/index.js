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

let dungeon, explorer, treasure, door, state;
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
spritesheet.parse(setup);

function setup(textures) {
    dungeon = new Sprite(textures["dungeon.png"]);
    explorer = new Sprite(textures["explorer.png"]);
    treasure = new Sprite(textures["treasure.png"]);
    stage.addChild(dungeon);

    stage.addChild(explorer);

    stage.addChild(treasure);

    door = new Sprite(textures["door.png"]);

    // makeBlobs(textures);
    stage.addChild(door);

    explorer.position.set(16, 16);
    treasure.position.set(32, 32);
    door.position.set(64, 64);
    
    explorer.vx = 0;
    explorer.vy = 0;

    // superFastSprites.addChild(explorer);
    // superFastSprites.addChild(door);
    // superFastSprites.addChild(treasure);
    // superFastSprites.position.set(128, 128)
    // stage.addChild(superFastSprites);
    drawRect();
    // drawCircle();
    // drawEllipse();
    // drawRoundedRect();
    // drawLine();
    // drawTriangle();
    drawText();
    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

function drawRect() {
    rectangle.beginFill(0x66CCFF);
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.drawRect(0, 0, 100, 100);
    rectangle.endFill();
    rectangle.x = 170;
    rectangle.y = 170;
    stage.addChild(rectangle);
}

function drawCircle() {
    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 64;
    circle.y = 130;
    stage.addChild(circle);
}

function drawEllipse() {
    ellipse.beginFill(0xFFFF00);
    ellipse.drawEllipse(0, 0, 50, 20);
    ellipse.endFill();
    ellipse.x = 180;
    ellipse.y = 130;
    stage.addChild(ellipse);
}

function drawRoundedRect() {
    roundBox.lineStyle(4, 0x99CCFF, 1);
    roundBox.beginFill(0xFF9933);
    roundBox.drawRoundedRect(0, 0, 84, 36, 10);
    roundBox.endFill();
    roundBox.x = 48;
    roundBox.y = 190;
    stage.addChild(roundBox);
}

function drawLine() {
    line.lineStyle(4, 0xFFFFFF, 1);
    line.moveTo(0, 0);
    line.lineTo(80, 50);
    line.x = 32;
    line.y = 32;
    stage.addChild(line);
}

function drawTriangle() {
    triangle.beginFill(0x66FF33);
    triangle.drawPolygon([
        -32, 64,
        32, 64,
        0, 0
    ]);
    triangle.endFill();
    triangle.x = 180;
    triangle.y = 22;
    stage.addChild(triangle);
}

function drawText() {
    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        });
    message.style = style;
    message.position.set(54, 96);
    stage.addChild(message);
    message.style = {wordWrap: true, wordWrapWidth: 10, align: 'center'};
    message.text = "Changed";
    message.style = {fill: "black", font: "16px PetMe64"};
}

function gameLoop(delta) {
    state(delta);
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
