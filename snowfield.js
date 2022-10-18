function getRandomSize() {
  //size given to the snowflake
  let r = pow(random(0, 1.5), 3); //it takes a random value between 0 and 1.5 and it multiplies it by 3 every time
  return constrain(r * 32, 2, 32); //constrain the value between 2 and 32 pixels
}

class Snowflake {
  constructor(sx, sy, img) {
    let x = sx || random(width);
    let y = sy || random(-100 - 10); //snowflakes start from the top (above the screen)
    this.img = img;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0); //velocity starts at 0
    this.acc = createVector();
    this.angle = random(TWO_PI);
    this.dir = random(1) > 0.5 ? 1 : -1 //ternary operation
    //if the random number is greater than 0.5 give a value of 1, otherwhise a negative 1
    this.xOff = 0;
    this.r = getRandomSize(); //size given to the snowflake
  }

  applyForce(force) {
    //add the force to the object acceleration
    //Parallax Effect hack
    let f = force.copy(); //copy of the incoming force
    f.mult(this.r * 0.001); //I multiply force by the object size (if it's bigger the force is stronger)
    this.acc.add(f); //add the force to the acceleration
  }

  randomize() {
    let x = random(width);
    let y = random(-100 - 10);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0); //velocity starts at 0
    this.acc = createVector();
    this.r = getRandomSize(); //size given to the snowflake
  }

  //the position of each snowflake changes overtime, based on the object's velocity
  update() {
    //add the velocity to the position every frame
    this.xOff = sin(this.angle * 2) * 2 * this.r;
    this.vel.add(this.acc); //add the object acceleration to his velocity
    this.vel.limit(this.r * 0.2); //terminal velocity. The limit is a vector function that takes a given vector and limits the lenght of it

    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }

    this.pos.add(this.vel); //I can use vector math to add the velocity to the position every frame
    this.acc.mult(0); //I clear out the acceleration every frame

    if (this.pos.y > height + this.r) {
      this.randomize(); //when the snowflakes get to the bottom, I recycle them to the top
    }

    //Wrapping Left and Right
    if (this.pos.x < -this.r) {
      //if the snowflakes go out the screen they appear on the other side (pacman effect)
      this.pos.x = width + this.r;
    }
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }
    this.angle += (this.dir * this.vel.mag()) / 200; //rotate on the velocity magnitude
  }

  render() {
    push();
    translate(this.pos.x + this.xOff, this.pos.y);
    rotate(this.angle); //rotate by a random angle between 0 and 360 degrees
    imageMode(CENTER);
    image(this.img, 0, 0, this.r, this.r);
    pop();
  }
}
