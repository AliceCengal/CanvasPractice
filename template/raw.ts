
class Particle {
  
  update: () => void;
  
  constructor(
      public xx: number,
      public yy: number,
      public vx: number,
      public vy: number) {
      
    this.update = () => {
      this.xx = this.xx + this.vx;
      this.yy = this.yy + this.vy;
    }
  }
}

class Simulation {

  ctx = null;
  xx: number;
  yy: number;
  ball: Image;
  
  loop: () => void;
  draw: () => void;
  update: () => void;
  clearWindow: () => void;

  constructor(public cnv) {
    this.ctx = cnv.getContext('2d');
    this.xx = 40;
    this.yy = 40;
    this.ball = new Image();
    this.ball.src = "http://i.imgur.com/2qjpEPE.png";
	
    this.loop = () => {
      this.draw();
      this.update();
    }
    
    this.draw = () => {
      this.clearWindow();
      this.ctx.fillStyle = 'blue';
      this.ctx.fillRect(this.xx, this.yy, 50, 50);
      
      this.ctx.drawImage(this.ball, 100, 100);
    }

    this.update = () => {
      this.xx = (this.xx + 5) % 200;
      this.yy = (this.yy + 5) % 200;
    }
    
    this.clearWindow = () => {
      this.ctx.fillStyle = '#e0e0e0';
      this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    }
        
  }

}

var canvas = document.getElementById('MyCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sim = new Simulation(canvas);
window.setInterval(sim.loop, 1000/30);
