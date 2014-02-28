
class Particle {
  
  constructor(
      public xx: number,
      public yy: number,
      public vx: number,
      public vy: number) {
  }
  
  update() {
    this.xx += this.vx;
    this.yy += this.vy;
  }
}

interface Field {
  updateWithParticle(p: Particle): void;
  updateWithTime(): void;
  influence(p: Particle): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

class VelocityFieldPoint {

  vX: number = 0;
  vY: number = 0;

  constructor(
      public xx: number,
      public yy: number,
      public influenceRadius: number,
      public bulkNormalizingConstant: number) {
  }

  updateWithParticle(p: Particle) {

    var dist = Math.sqrt(Math.pow(this.xx - p.xx, 2) + Math.pow(this.yy - p.yy, 2));
    this.vX += ( p.vx * Math.exp(-dist) );
    this.vY += ( p.vy * Math.exp(-dist) );

  }

  updateFinal() {
    this.vX /= this.bulkNormalizingConstant;
    this.vY /= this.bulkNormalizingConstant;
  }
}

class VelocityField {

  fieldPoints: VelocityFieldPoint[] = [];
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
        this.fieldPoints.push(
            new VelocityFieldPoint(
                this.cellWidth*(cellCol + 0.5),
                this.cellHeight*(cellRow + 0.5),
                worldWidth/2,
                1.01));
      }
    }
  }

  updateWithParticle(parc: Particle) {
    this.fieldPoints.forEach((vp) => {
      vp.updateWithParticle(parc)
      if (vp.vX > 10) {
        vp.vX /= 2.0;
      }
      if (vp.vY > 10) {
        vp.vY /= 2.0;
      }
    })
  }

  influence(p: Particle) {
    this.fieldPoints.forEach((vp) => {

      //var distX = Math.abs(vp.xx - p.xx);
      //var distY = Math.abs(vp.yy - p.yy);
      var dist = Math.sqrt(Math.pow(vp.xx - p.xx, 2) + Math.pow(vp.yy - p.yy, 2));

      var partMag = Math.sqrt(Math.pow(p.vx, 2) + Math.pow(p.vy, 2));
      var forceMag = Math.sqrt(Math.pow(vp.vX, 2) + Math.pow(vp.vY, 2));

      p.vx = ( (vp.vX) * Math.exp(-dist/1.0)) / ( 1 );
      p.vy = ( (vp.vY) * Math.exp(-dist/1.0)) / ( 1 );

      //p.vx += ( vp.vX * Math.exp(-distX) );
      //p.vy += ( vp.vY * Math.exp(-distY) );

    });
  }

  updateWithTime() {}

  draw(ctx: CanvasRenderingContext2D) {
    this.fieldPoints.forEach((fp) => {
      ctx.fillStyle = "#dd0000";
      ctx.fillRect(fp.xx, fp.yy, 5, 5);
    })
  }

}



class Simulation {

  ctx: CanvasRenderingContext2D;

  balls: Particle[] = [];
  
  worldWidth: number;
  worldHeight: number;

  field: Field;
  maxV: number = 50;

  constructor(public cnv: HTMLCanvasElement) {
    this.ctx = cnv.getContext('2d');
    this.worldHeight = cnv.height;
    this.worldWidth = cnv.width;
    
    for (var i = 0; i < 500; i++) {
      this.balls[i] = new Particle(
          (Math.random()*this.worldWidth),
          (Math.random()*this.worldHeight),
          (Math.random()*10) - 5,
          (Math.random()*10) - 5)
    }

    this.field = new VelocityField(
        30, 30,
        this.worldWidth, this.worldHeight,
        1000);
  }

  loop() {
    this.draw();
    this.update();
  }

  cycle: number = 0;

  update() {
    this.cycle = (this.cycle + 1) % 10
    if (this.cycle === 0) {
      //console.log("Field Update loop")
      this.balls.forEach((p: Particle) => {
        this.field.updateWithParticle(p);
        this.field.influence(p);
      });
    }
    this.balls.forEach((p: Particle) => {
      this.updateBalls(p);
    })
  }
  
  updateBalls(p: Particle) {
    p.update();
    
    if (p.xx > this.worldWidth) {
      p.xx = this.worldWidth - (p.xx - this.worldWidth);
      p.vx = -p.vx;
    }
    
    if (p.xx < 0) {
      p.xx = -p.xx;
      p.vx = -p.vx;
    }
    
    if (p.yy > this.worldHeight) {
      p.yy = this.worldHeight - (p.yy - this.worldHeight);
      p.vy = -p.vy;
    }
    
    if (p.yy < 0) {
      p.yy = -p.yy;
      p.vy = -p.vy;
    }

    if (Math.abs(p.vx) > this.maxV) {
      p.vx /= 2;
    }

    if (Math.abs(p.vy) > this.maxV) {
      p.vy /= 2;
    }
  }
  
  clearWindow() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
  }
  
  drawBall(p: Particle) {
    this.ctx.fillStyle = '#d0d0d0'
    this.ctx.fillRect(p.xx, p.yy, 2, 2);
  } 

  draw() {
    this.clearWindow();
    this.balls.forEach((p: Particle) => {
      this.drawBall(p);
    })

    //this.field.draw(this.ctx);
  }

}

var canvas = <HTMLCanvasElement> document.getElementById('MyCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sim = new Simulation(canvas);
window.setInterval(() => { sim.loop(); }, 1000/30);
