/**
 * Donut Chart
 * @author mazurinv@gmail.com
 * web page: http://mazurinv.ru
 */
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var DonutChart = function (params) {
    if (document.getElementById(params.id) === null) {
        return;
    }
    if (DonutChart.prototype.instances[params.id] !== undefined) {
        DonutChart.prototype.instances[params.id].redraw();
        return;
    }
    this.params = Object.create(DonutChart.prototype.defaultParams);
    this.properties = Object.create(DonutChart.prototype.properties);
    for (var key in params) {
        this.params[key] = params[key];
    }
    DonutChart.prototype.instances[params.id] = this;
    this.frameTime = -1;
    this.draw()
};
DonutChart.prototype.instances = {};
DonutChart.prototype.properties = {
    ctx: undefined,
    curr: 0,
    canvasWidth: 0,
    canvasHeight: 0
};
DonutChart.prototype.defaultParams = {
    id: 'donutChart',
    radius: 100,
    percentage: 90,
    lineWidth: 3,
    lineColor: "#003951",
    fontColor: "#003951",
    backgroundColor: "transparent"
};
DonutChart.prototype.redraw = function () {
    this.properties.curr = 0;
    this.draw()
};
DonutChart.prototype.draw = function() {
    var wrapper = document.getElementById(this.params.id);
    var fontSize = this.params.radius / 2 ;
    var top = (this.params.radius - fontSize) * 0.5 + this.params.lineWidth
    var width = (this.params.radius + this.params.lineWidth) * 2;
    var styles = 'style="position:absolute;color:'+this.params.fontColor+';font-size:'+fontSize+'px;text-align:center;top:'+top+'px;width:'+width+'px;"';
    wrapper.innerHTML = "<p "+styles+">"+this.params.percentage+"%</p><canvas id='"+this.params.id+"_canvas'></canvas>";

    this.properties.ctx = document.getElementById(this.params.id+"_canvas").getContext('2d');
    this.properties.canvasWidth = width;
    this.properties.canvasHeight = (this.params.radius + this.params.lineWidth) * 2;
    document.getElementById(this.params.id+'_canvas').setAttribute("width", this.properties.canvasWidth);
    document.getElementById(this.params.id+'_canvas').setAttribute("height", this.properties.canvasHeight);
    document.getElementById(this.params.id).style.position = "relative";


    this.animate();
};
DonutChart.prototype.animate = function (draw_to) {
    var ctx = this.properties.ctx;
    if (draw_to !== undefined) {
        ctx.clearRect(0, 0, this.properties.canvasWidth, this.properties.canvasHeight);
    }
    if (this.params.backgroundColor !== 'transparent') {
        ctx.beginPath();
        ctx.arc(
            this.params.radius+this.params.lineWidth,
            this.params.radius+this.params.lineWidth,
            this.params.radius+this.params.lineWidth / 2,
            0,
            Math.PI * 2,
            false
        );
        ctx.fillStyle = this.params.backgroundColor;
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(
        this.params.radius+this.params.lineWidth,
        this.params.radius+this.params.lineWidth,
        this.params.radius,
        -Math.PI/2,
        draw_to,
        false
    );
    ctx.fillStyle = 'transparent';
    ctx.fill();
    ctx.lineWidth = this.params.lineWidth;
    ctx.strokeStyle = this.params.lineColor;
    ctx.stroke();
    this.properties.curr++;
    requestAnimationFrame(function (frameTime) {
        for (var key in DonutChart.prototype.instances) {
            var instance = DonutChart.prototype.instances[key];
            if (instance.properties.frameTime === frameTime) {
                return;
            }
            if (instance.properties.curr <= instance.params.percentage) {
                instance.properties.frameTime = frameTime;
                instance.animate(2 * Math.PI / 100 * instance.properties.curr - Math.PI / 2);
            }
        }
    });
};