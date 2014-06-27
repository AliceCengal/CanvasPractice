
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function sign(num: number): number {
  if (num > 0) {
    return 1;
  } else if (num < 0) {
    return -1;
  } else {
    return 0;
  }
}

function angle(x: number, y: number): number {
  var angle1 = Math.abs(Math.atan(y/x));
  return sign(y) * ((sign(x) == 1) ? angle1 : (Math.PI-angle1));
}

function mag(x: number, y: number): number {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

class Particle {
  
  constructor(
      public xx: number,
      public yy: number,
      public vx: number,
      public vy: number,
      public m: number) {
  }
  
  update() {
    this.xx += this.vx;
    this.yy += this.vy;
  }
  
  applyForce(fx: number, fy: number) {
    this.vx += (fx/this.m);
    this.vy += (fy/this.m);
  }
}

interface Field {
  interact(p: Particle): void;
}

class VelocityField {

  fieldPoints: number[] = [];
  cellHeight: number;
  cellWidth: number;

  constructor(
      public fieldWidth: number,
      public fieldHeight: number,
      public worldWidth: number,
      public worldHeight: number,
      public totalParticleCount: number) {

    this.cellWidth = worldWidth / fieldWidth;
    this.cellHeight = worldHeight / fieldHeight;

    for (var cellRow = 0; cellRow < fieldHeight; cellRow++) {
      for (var cellCol = 0; cellCol < fieldWidth; cellCol++) {
        
      }
    }
  }

  interact(p: Particle) {
  }

}

class BrakingField {
  maxV: number = 10;

  interact(p: Particle) {
    var vMag = mag(p.vx, p.vy);
    if (vMag > this.maxV) {
      var a = angle(p.vx, p.vy);
      p.applyForce((this.maxV - vMag)*0.75*Math.cos(a), 
                   (this.maxV - vMag)*0.75*Math.sin(a));
    }
  }
  
}

class GravityField {
  constructor(public centerX: number,
              public centerY: number) { 
  }
  
  interact(p: Particle) {
    var d = mag(p.xx - this.centerX, p.yy - this.centerY);
    var a = angle(p.xx - this.centerX, p.yy - this.centerY) + Math.PI;
    p.applyForce(d*Math.cos(a)/500, d*Math.sin(a)/500);
  }
  
}

class CurlingField {
  constructor(public centerX: number,
              public centerY: number) {}
  
  interact(p: Particle) {
    var d = mag(p.xx - this.centerX, p.yy - this.centerY)/500;
    var a = angle(p.vx, p.vy) - 0.5*Math.PI;
    p.applyForce(d*Math.cos(a), d*Math.sin(a));
  }
}

class Simulation {
  balls: Particle[] = [];
  
  worldWidth: number;
  worldHeight: number;

  centerX: number;
  centerY: number;
  
  fields: Field[] = [];

  time: number = 0;
  fps: number = 0;
  frameDur: number = 0;
  
  constructor(width: number, height: number) {
    this.worldHeight = height;
    this.worldWidth = width;
    this.centerX = width/2;
    this.centerY = height/2;
    
    for (var i = 0; i < 1000; i++) {
      this.balls[i] = new Particle(
          (Math.random()*this.worldWidth),
          (Math.random()*this.worldHeight),
          (Math.random()*10) - 5,
          (Math.random()*10) - 5,
          (Math.random()*5) + 1)
    }

    this.fields = [
      new BrakingField(),
      new GravityField(this.centerX, this.centerY),
      new CurlingField(this.centerX, this.centerY)
    ];
    
    this.time = Date.now();
    this.fps = 30;
    this.frameDur = 100;
  }

  cycle: number = 0;

  update() {
    var start = Date.now();
    
    for (var p = 0; p < this.balls.length; p++) {
      this.balls[p].update();
      for (var f = 0; f < this.fields.length; f++) {
        this.fields[f].interact(this.balls[p]);
      }
    }
    
    var now = Date.now();
    this.frameDur = now - start;
    this.fps = Math.round(1000/(now - this.time));
    this.time = now
  }

}
