let snow = []; //empty array where snowflakes are created
let gravity; //gravity isn't part of the snowflake, it's part of the world
let zOff = 0;

let spritesheet; //image of the snowflakes
let textures = [];
let topLayer; //front cover that has to be removed by scratching
let stamp; //snowflake mold used to erase the topLayer

function preload() {
  spritesheet = loadImage('./assets/images/flakes32.png'); //image of snowflake
  stamp = loadImage('./assets/images/mold.png');
}

function setup() {
  let myText1 = 'Scratch Me Out';
  createCanvas(windowWidth, windowHeight);

  gravity = createVector(0, 0.3); //there's a small gravity pointing down
  for (let x = 0; x < spritesheet.width; x += 32) {
    //every snowflake is 32x32 pixels
    for (let y = 0; y < spritesheet.height; y += 32) {
      let img = spritesheet.get(x, y, 32, 32); //pull out a slice of the image that is big 32x32 pixels
      textures.push(img); //add a snowflake in the texture array
    }
  }

  for (let i = 0; i < 400; i++) {
    //there are 400 snowflakes
    //the position of the snowflakes is random
    let x = random(width);
    let y = random(height);
    let design = random(textures); //it takes random snowflakes in the spritesheet
    snow.push(new Snowflake(x, y, design));
  }

  //top layer to be scratched out with mouse pressing
  topLayer = createGraphics(windowWidth, windowHeight);
  topLayer.background(color('rgb(255, 255, 255)'));
  topLayer.textSize(100);
  topLayer.textAlign(CENTER);
  topLayer.textFont('Special Elite');
  topLayer.text(myText1, width / 2, height / 2);
  stamp.resize(270, 0);
  topLayer.blendMode(REMOVE); //it is used to remove pixels from the top layer
}

function draw() {
  let myText = 'Winter is Coming';
  background(0);
  zOff += 0.1; //changes the perlin noise value over time

  for (flake of snow) {
    //for every element of the array
    //it is used to avoid that snowflakes drop straight
    let xOff = flake.pos.x / width;
    let yOff = flake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle); //wind angle
    wind.mult(0.1); //force of the wind which moves the snowflakes
    //the wind is smaller than gravity so that snowflakes drop down and don't go up
    //every snowflake has a different wind

    flake.applyForce(gravity); //apply gravity to each snowflake
    flake.applyForce(wind); //it allows snowflakes to move (from left to right or vice versa)
    flake.update();
    flake.render();
  }

  if (mouseIsPressed) {
    //function used to remove the top layer and show the animated wallpaper
    topLayer.image(stamp, mouseX, mouseY);
  }

  //writing 'Winter is Coming'
  fill(color('rgba(255, 255, 266, 0.8)'));
  textFont('Petit Formal Script');
  textStyle(ITALIC);
  textAlign(CENTER);
  textSize(100);
  text(myText, width / 2, height / 2);
  image(topLayer, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
