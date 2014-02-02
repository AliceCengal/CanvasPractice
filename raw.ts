
class Particle {
  
  constructor(
      public xx: number,
      public yy: number,
      public vx: number,
      public vy: number) {
  }
  
  update() {
    this.xx = this.xx + this.vx;
    this.yy = this.yy + this.vy;
  }
}

class Simulation {

  ctx: CanvasRenderingContext2D;
  xx: number;
  yy: number;
  
  balls: Particle[] = [];
  
  ballImage: HTMLImageElement;
  ballHeight: number;
  ballWidth: number;
  
  worldWidth: number;
  worldHeight: number;

  constructor(public cnv: HTMLCanvasElement) {
    this.ctx = cnv.getContext('2d');
    this.worldHeight = cnv.height;
    this.worldWidth = cnv.width;
    this.ballImage = new HTMLImageElement();
    this.ballImage.src = "http://i.imgur.com/2qjpEPE.png";
    
    for (var i = 0; i < 50; i++) {
      this.balls[i] = new Particle(
          (Math.random()*this.worldWidth),
          (Math.random()*this.worldHeight),
          (Math.random()*10) - 5,
          (Math.random()*10) - 5)
    }
    
  }

  loop() {
    this.draw();
    this.update();
  }
    
  update() {
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
    
  }

  clearWindow() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
  }
  
  drawBall(p: Particle) {
    this.ctx.drawImage(this.ballImage, p.xx, p.yy)
  } 

  draw() {
    this.clearWindow();
    this.balls.forEach((p: Particle) => {
      this.drawBall(p);
    })
  }

}

var canvas = <HTMLCanvasElement> document.getElementById('MyCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sim = new Simulation(canvas);
window.setInterval(() => { sim.loop(); }, 1000/30);
