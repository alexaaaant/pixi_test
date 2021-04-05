import * as PIXI from 'pixi.js';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

//Create a Pixi Application
const app = new PIXI.Application({width: 256, height: 256});
app.renderer.backgroundColor = 0x061639;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);