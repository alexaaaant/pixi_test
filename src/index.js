import * as PIXI from 'pixi.js';
import Cat from '../images/cat.png';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

const Application = PIXI.Application,
    Loader = PIXI.Loader,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
const app = new Application({
    width: 256, 
    height: 256,
    antialias: true,
    resolution: 1,
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const stage = app.stage;
const imagePath = Cat;
const loader = new Loader();
loader
    .add(imagePath)
    .load(setup)
    

loader.onProgress.add(loadProgressHandler);

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

function setup() {
    const cat = new Sprite(
        loader.resources[imagePath].texture
    );
      //Change the sprite's position
    // cat.position.set(96, 96);

    // cat.width = 80;
    // cat.height = 120;

    // cat.scale.set(0.5, 0.5);

    // cat.anchor.x = 0.5;
    // cat.anchor.y = 0.5;
    // cat.rotation = 0.5;

    // cat.pivot.set(32, 32)

    stage.addChild(cat);
}
