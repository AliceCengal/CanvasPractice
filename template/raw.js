var Simulation = (function () {
    function Simulation(cnv) {
        var _this = this;
        this.cnv = cnv;
        this.ctx = null;
        this.ctx = cnv.getContext('2d');
        this.xx = 40;
        this.yy = 40;
        this.ball = new Image();
        this.ball.src = "http://i.imgur.com/2qjpEPE.png";

        this.loop = function () {
            _this.draw();
            _this.update();
        };

        this.draw = function () {
            _this.clearWindow();
            _this.ctx.fillStyle = 'blue';
            _this.ctx.fillRect(_this.xx, _this.yy, 50, 50);

            _this.ctx.drawImage(_this.ball, 100, 100);
        };

        this.update = function () {
            _this.xx = (_this.xx + 5) % 200;
            _this.yy = (_this.yy + 5) % 200;
        };

        this.clearWindow = function () {
            _this.ctx.fillStyle = '#e0e0e0';
            _this.ctx.fillRect(0, 0, _this.cnv.width, _this.cnv.height);
        };
    }
    return Simulation;
})();

var canvas = document.getElementById('MyCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sim = new Simulation(canvas);
window.setInterval(sim.loop, 1000 / 30);
