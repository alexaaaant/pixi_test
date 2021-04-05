import * as PIXI from 'pixi.js';
import Cat from '../images/cat.png';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

//Create a Pixi Application
const app = new PIXI.Application({
    width: 256, 
    height: 256,
    antialias: true,
    resolution: 1,
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const stage = app.stage;
const imagePath = Cat;
const loader = new PIXI.Loader();
loader
.add(imagePath)
.load(setup)

function setup() {
    const cat = new PIXI.Sprite(
        loader.resources[imagePath].texture
    );
    stage.addChild(cat);
}
