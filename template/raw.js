var Particle = (function () {
    function Particle(xx, yy, vx, vy) {
        this.xx = xx;
        this.yy = yy;
        this.vx = vx;
        this.vy = vy;
    }
    Particle.prototype.update = function () {
        this.xx = this.xx + this.vx;
        this.yy = this.yy + this.vy;
    };
    return Particle;
})();

var Simulation = (function () {
    function Simulation(cnv) {
        this.cnv = cnv;
        this.ctx = cnv.getContext('2d');
        this.worldHeight = cnv.height;
        this.worldWidth = cnv.width;
        this.xx = 40;
        this.yy = 40;
        this.ball = new Image();
        this.ball.src = "http://i.imgur.com/2qjpEPE.png";
    }
    Simulation.prototype.loop = function () {
        this.draw();
        this.update();
    };

    Simulation.prototype.draw = function () {
        this.clearWindow();
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.xx, this.yy, 50, 50);
        this.ctx.drawImage(this.ball, 100, 100);
    };

    Simulation.prototype.update = function () {
        this.xx = (this.xx + 5) % 200;
        this.yy = (this.yy + 5) % 200;
    };

    Simulation.prototype.clearWindow = function () {
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    };
    return Simulation;
})();

var canvas = document.getElementById('MyCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sim = new Simulation(canvas);
window.setInterval(function () {
    sim.loop();
}, 1000 / 30);
