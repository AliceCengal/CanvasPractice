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
        this.balls = [];
        this.ctx = cnv.getContext('2d');
        this.worldHeight = cnv.height;
        this.worldWidth = cnv.width;
        this.ballImage = new HTMLImageElement();
        this.ballImage.src = "http://i.imgur.com/2qjpEPE.png";

        for (var i = 0; i < 50; i++) {
            this.balls[i] = new Particle((Math.random() * this.worldWidth), (Math.random() * this.worldHeight), (Math.random() * 10) - 5, (Math.random() * 10) - 5);
        }
    }
    Simulation.prototype.loop = function () {
        this.draw();
        this.update();
    };

    Simulation.prototype.update = function () {
        var _this = this;
        this.balls.forEach(function (p) {
            _this.updateBalls(p);
        });
    };

    Simulation.prototype.updateBalls = function (p) {
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
    };

    Simulation.prototype.clearWindow = function () {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    };

    Simulation.prototype.drawBall = function (p) {
        this.ctx.drawImage(this.ballImage, p.xx, p.yy);
    };

    Simulation.prototype.draw = function () {
        var _this = this;
        this.clearWindow();
        this.balls.forEach(function (p) {
            _this.drawBall(p);
        });
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
