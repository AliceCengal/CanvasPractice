function createArray(length) {
    var arr = new Array(length || 0), i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--)
            arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function sign(num) {
    if (num > 0) {
        return 1;
    } else if (num < 0) {
        return -1;
    } else {
        return 0;
    }
}

function angle(x, y) {
    var angle1 = Math.abs(Math.atan(y / x));
    return sign(y) * ((sign(x) == 1) ? angle1 : (Math.PI - angle1));
}

function mag(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

var Particle = (function () {
    function Particle(xx, yy, vx, vy, m) {
        this.xx = xx;
        this.yy = yy;
        this.vx = vx;
        this.vy = vy;
        this.m = m;
    }
    Particle.prototype.update = function () {
        this.xx += this.vx;
        this.yy += this.vy;
    };

    Particle.prototype.applyForce = function (fx, fy) {
        this.vx += (fx / this.m);
        this.vy += (fy / this.m);
    };
    return Particle;
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
            }
        }
    }
    VelocityField.prototype.interact = function (p) {
    };
    return VelocityField;
})();

var BrakingField = (function () {
    function BrakingField() {
        this.maxV = 10;
    }
    BrakingField.prototype.interact = function (p) {
        var vMag = mag(p.vx, p.vy);
        if (vMag > this.maxV) {
            var a = angle(p.vx, p.vy);
            p.applyForce((this.maxV - vMag) * 0.75 * Math.cos(a), (this.maxV - vMag) * 0.75 * Math.sin(a));
        }
    };
    return BrakingField;
})();

var GravityField = (function () {
    function GravityField(centerX, centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
    }
    GravityField.prototype.interact = function (p) {
        var d = mag(p.xx - this.centerX, p.yy - this.centerY);
        var a = angle(p.xx - this.centerX, p.yy - this.centerY) + Math.PI;
        p.applyForce(d * Math.cos(a) / 500, d * Math.sin(a) / 500);
    };
    return GravityField;
})();

var CurlingField = (function () {
    function CurlingField(centerX, centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
    }
    CurlingField.prototype.interact = function (p) {
        var d = mag(p.xx - this.centerX, p.yy - this.centerY) / 500;
        var a = angle(p.vx, p.vy) - 0.5 * Math.PI;
        p.applyForce(d * Math.cos(a), d * Math.sin(a));
    };
    return CurlingField;
})();

var Simulation = (function () {
    function Simulation(width, height) {
        this.balls = [];
        this.fields = [];
        this.time = 0;
        this.fps = 0;
        this.frameDur = 0;
        this.cycle = 0;
        this.worldHeight = height;
        this.worldWidth = width;
        this.centerX = width / 2;
        this.centerY = height / 2;

        for (var i = 0; i < 1000; i++) {
            this.balls[i] = new Particle((Math.random() * this.worldWidth), (Math.random() * this.worldHeight), (Math.random() * 10) - 5, (Math.random() * 10) - 5, (Math.random() * 5) + 1);
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
    Simulation.prototype.update = function () {
        var start = Date.now();

        for (var p = 0; p < this.balls.length; p++) {
            this.balls[p].update();
            for (var f = 0; f < this.fields.length; f++) {
                this.fields[f].interact(this.balls[p]);
            }
        }

        var now = Date.now();
        this.frameDur = now - start;
        this.fps = Math.round(1000 / (now - this.time));
        this.time = now;
    };
    return Simulation;
})();
