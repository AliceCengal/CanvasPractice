var Particle = (function () {
    function Particle(xx, yy, vx, vy) {
        this.xx = xx;
        this.yy = yy;
        this.vx = vx;
        this.vy = vy;
    }
    Particle.prototype.update = function () {
        this.xx += this.vx;
        this.yy += this.vy;
    };
    return Particle;
})();

var VelocityFieldPoint = (function () {
    function VelocityFieldPoint(xx, yy, influenceRadius, bulkNormalizingConstant) {
        this.xx = xx;
        this.yy = yy;
        this.influenceRadius = influenceRadius;
        this.bulkNormalizingConstant = bulkNormalizingConstant;
        this.vX = 0;
        this.vY = 0;
    }
    VelocityFieldPoint.prototype.updateWithParticle = function (p) {
        var dist = Math.sqrt(Math.pow(this.xx - p.xx, 2) + Math.pow(this.yy - p.yy, 2));
        this.vX += (p.vx * Math.exp(-dist));
        this.vY += (p.vy * Math.exp(-dist));
    };

    VelocityFieldPoint.prototype.updateFinal = function () {
        this.vX /= this.bulkNormalizingConstant;
        this.vY /= this.bulkNormalizingConstant;
    };
    return VelocityFieldPoint;
})();

var VelocityField = (function () {
    function VelocityField(fieldWidth, fieldHeight, worldWidth, worldHeight, totalParticleCount) {
        this.fieldWidth = fieldWidth;
        this.fieldHeight = fieldHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.totalParticleCount = totalParticleCount;
        this.fieldPoints = [];
        this.cellWidth = worldWidth / fieldWidth;
        this.cellHeight = worldHeight / fieldHeight;

        for (var cellRow = 0; cellRow < fieldHeight; cellRow++) {
            for (var cellCol = 0; cellCol < fieldWidth; cellCol++) {
                this.fieldPoints.push(new VelocityFieldPoint(this.cellWidth * (cellCol + 0.5), this.cellHeight * (cellRow + 0.5), worldWidth / 2, 1.01));
            }
        }
    }
    VelocityField.prototype.updateWithParticle = function (parc) {
        this.fieldPoints.forEach(function (vp) {
            vp.updateWithParticle(parc);
            if (vp.vX > 10) {
                vp.vX /= 2.0;
            }
            if (vp.vY > 10) {
                vp.vY /= 2.0;
            }
        });
    };

    VelocityField.prototype.influence = function (p) {
        this.fieldPoints.forEach(function (vp) {
            //var distX = Math.abs(vp.xx - p.xx);
            //var distY = Math.abs(vp.yy - p.yy);
            var dist = Math.sqrt(Math.pow(vp.xx - p.xx, 2) + Math.pow(vp.yy - p.yy, 2));

            var partMag = Math.sqrt(Math.pow(p.vx, 2) + Math.pow(p.vy, 2));
            var forceMag = Math.sqrt(Math.pow(vp.vX, 2) + Math.pow(vp.vY, 2));

            p.vx = ((vp.vX) * Math.exp(-dist / 1.0)) / (1);
            p.vy = ((vp.vY) * Math.exp(-dist / 1.0)) / (1);
            //p.vx += ( vp.vX * Math.exp(-distX) );
            //p.vy += ( vp.vY * Math.exp(-distY) );
        });
    };

    VelocityField.prototype.updateWithTime = function () {
    };

    VelocityField.prototype.draw = function (ctx) {
        this.fieldPoints.forEach(function (fp) {
            ctx.fillStyle = "#dd0000";
            ctx.fillRect(fp.xx, fp.yy, 5, 5);
        });
    };
    return VelocityField;
})();

var Simulation = (function () {
    function Simulation(cnv) {
        this.cnv = cnv;
        this.balls = [];
        this.maxV = 50;
        this.cycle = 0;
        this.ctx = cnv.getContext('2d');
        this.worldHeight = cnv.height;
        this.worldWidth = cnv.width;

        for (var i = 0; i < 500; i++) {
            this.balls[i] = new Particle((Math.random() * this.worldWidth), (Math.random() * this.worldHeight), (Math.random() * 10) - 5, (Math.random() * 10) - 5);
        }

        this.field = new VelocityField(30, 30, this.worldWidth, this.worldHeight, 1000);
    }
    Simulation.prototype.loop = function () {
        this.draw();
        this.update();
    };

    Simulation.prototype.update = function () {
        var _this = this;
        this.cycle = (this.cycle + 1) % 10;
        if (this.cycle === 0) {
            //console.log("Field Update loop")
            this.balls.forEach(function (p) {
                _this.field.updateWithParticle(p);
                _this.field.influence(p);
            });
        }
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

        if (Math.abs(p.vx) > this.maxV) {
            p.vx /= 2;
        }

        if (Math.abs(p.vy) > this.maxV) {
            p.vy /= 2;
        }
    };

    Simulation.prototype.clearWindow = function () {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    };

    Simulation.prototype.drawBall = function (p) {
        this.ctx.fillStyle = '#d0d0d0';
        this.ctx.fillRect(p.xx, p.yy, 2, 2);
    };

    Simulation.prototype.draw = function () {
        var _this = this;
        this.clearWindow();
        this.balls.forEach(function (p) {
            _this.drawBall(p);
        });
        //this.field.draw(this.ctx);
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
