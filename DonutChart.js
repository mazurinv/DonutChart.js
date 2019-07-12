/**
 * Donut Chart
 * @author mazurinv@gmail.com
 * web page: http://mazurinv.ru
 */

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
DonutChart.prototype.requestAnimationFrameLaunched = false;
DonutChart.prototype.instances = {};
DonutChart.prototype.properties = {
    ctx: undefined,
    curr: 0,
    canvasWidth: 0,
    canvasHeight: 0
};
DonutChart.prototype.defaultParams = {
    id: 'donutChart',
    type: 'percentage', // percentage or milestones
    radius: 100,
    percentage: 90,
    speed: 1,
    lineWidth: 3,
    lineColor: "#003951",
    fontColor: "#003951",
    backLineColor: "transparent",
    backgroundColor: "transparent",
    pointer: undefined,
    pointerWidth: 30,
    header: "",
    suffix: "%",
    milestoneImage: "",
    value: undefined,
    onRedraw: function() {},
    onAnimationEnd: function() {},
    nextStep: function(step) {}
};
DonutChart.prototype.redraw = function () {
    this.properties.curr = 0;
    this.draw()
};
DonutChart.prototype.draw = function() {
    this.params.onRedraw();
    var wrapper = document.getElementById(this.params.id);
    var fontSize = this.params.radius / 2 ;
    var headerSize = this.params.radius / 6 ;

    var w = this.params.pointer !== undefined && this.params.pointerWidth > this.params.lineWidth
      ? this.params.pointerWidth
      : this.params.lineWidth;
    var width = (this.params.radius + w) * 2;

    this.properties.center = {
      x: this.params.radius + w,
      y: this.params.radius + w
    }
    var top = this.properties.center.y - fontSize/2;
    if (this.params.header.length) {
      top = top - headerSize / 2;
    }

    wrapper.style.width = width+"px"
    var html = ''
    html += "<div class='donutChart_title' style='position:absolute;text-align:center;top:"+top+"px;width:"+width+"px;'>"
    if (this.params.header.length) {
      html += "<span class='donutChart_title_header' style='color:"+this.params.fontColor+";font-size:"+headerSize+"px;'>" + this.params.header + "</span><br/>";
    }
    html += "<span id='"+this.params.id+"_text' style='line-height: normal;color:"+this.params.fontColor+";font-size:"+fontSize+"px;'>"+this.params.percentage+this.params.suffix+"</span>"
    html += "</div>"
    html += "<canvas id='"+this.params.id+"_canvas'></canvas>";
    wrapper.innerHTML = html

    this.properties.ctx = document.getElementById(this.params.id+"_canvas").getContext('2d');
    this.properties.canvasWidth = width;
    this.properties.canvasHeight = width;
    document.getElementById(this.params.id+'_canvas').setAttribute("width", this.properties.canvasWidth);
    document.getElementById(this.params.id+'_canvas').setAttribute("height", this.properties.canvasHeight);
    document.getElementById(this.params.id).style.position = "relative";

    if (this.params.pointer !== undefined) {
      this.properties.pointer = new Image();
      var that = this;
      this.properties.pointer.onload = function() {
        that.params.pointerRatio = this.width / this.height;
        if (that.params.milestoneImage !== '') {
          that.properties.milestone = new Image();
          that.properties.milestone.onload = function() {
            that.params.milestoneRatio = this.width / this.height;
            that.animate();
          }
          that.properties.milestone.src = that.params.milestoneImage;
        } else {
          that.animate();
        }
      };
      this.properties.pointer.src = this.params.pointer;
    } else {
      this.animate();
    }
};
DonutChart.prototype.getColour = function(ctx, colour) {
  if (colour.indexOf(":") === -1) {
    return colour
  }
  var grd
  var gradientColours = colour.split(":")
  grd = ctx.createRadialGradient(this.params.radius*2, this.params.radius*2, this.params.radius/10, this.params.radius*2, this.params.radius*2, this.params.radius*2);
  grd.addColorStop(0, gradientColours[0]);
  grd.addColorStop(1, gradientColours[1]);
  return grd
}
DonutChart.prototype.animate = function (draw_to) {
    var ctx = this.properties.ctx;
    ctx.clearRect(0, 0, this.properties.canvasWidth, this.properties.canvasHeight);
    if (this.params.backgroundColor !== 'transparent') {
        ctx.beginPath();
        ctx.arc(
            this.properties.center.x, // x
            this.properties.center.y, // y
            this.params.radius-this.params.lineWidth / 2, // radius
            0, // angle from
            Math.PI * 2, // angle to
            false
        );
        ctx.fillStyle = this.getColour(ctx, this.params.backgroundColor);
        ctx.fill();
    }
    if (this.params.backLineColor !== 'transparent') {
        ctx.beginPath();
        ctx.arc(
          this.properties.center.x, // x
          this.properties.center.y, // y
          this.params.radius,
          0,
          Math.PI * 2,
          false
        );
        ctx.fillStyle = 'transparent';
        ctx.lineWidth = this.params.lineWidth;
        ctx.strokeStyle = this.getColour(ctx, this.params.backLineColor);
        ctx.stroke();
        ctx.fill();
    }

    // let's draw trace
    ctx.beginPath();
    ctx.arc(
      this.properties.center.x, // x
      this.properties.center.y, // y
        this.params.radius,
        -Math.PI/2,
        (draw_to + Math.PI/2) % (2 * Math.PI) - Math.PI/2,
        false
    );
    ctx.fillStyle = 'transparent';
    ctx.fill();
    ctx.lineWidth = this.params.lineWidth;
    ctx.strokeStyle = this.getColour(ctx, this.params.lineColor);
    ctx.stroke();

    if (this.params.type === 'milestones' && this.properties.milestone !== undefined) {
      // draw milestones
      for (var i = 0; i < this.params.milestonesCount; i++) {
        var w = this.params.pointerWidth;
        var h = this.params.pointerWidth * this.params.milestoneRatio
        ctx.drawImage(
          this.properties.milestone,
          this.properties.center.x + this.params.radius * Math.cos(2*Math.PI * i / this.params.milestonesCount - Math.PI/2) - this.params.pointerWidth / 2,
          this.properties.center.y + this.params.radius * Math.sin(2*Math.PI * i / this.params.milestonesCount - Math.PI/2) - this.params.pointerWidth / 2,
          w,
          h
        );
      }
    }

    // draw pointer
    if (this.params.pointer !== undefined) {
      var w = this.params.pointerWidth;
      var h = this.params.pointerWidth * this.params.pointerRatio
      ctx.drawImage(
        this.properties.pointer,
        this.properties.center.x + this.params.radius * Math.cos(draw_to) - this.params.pointerWidth / 2,
        this.properties.center.y + this.params.radius * Math.sin(draw_to) - this.params.pointerWidth / 2,
        w,
        h
      );
    }

    this.properties.curr += this.params.speed;

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    requestAnimationFrame(function (frameTime, elem) {
        for (var key in DonutChart.prototype.instances) {
            var instance = DonutChart.prototype.instances[key];
            if (instance.properties.frameTime === frameTime) {
              continue;
            }
            if (instance.params.type === 'percentage') {
              if (instance.properties.curr <= instance.params.percentage) {
                  instance.properties.frameTime = frameTime;
                  var title = instance.params.value !== undefined ? (instance.params.value * Math.ceil(instance.properties.curr / instance.params.percentage * 100) / 100) : Math.ceil(instance.properties.curr);
                  document.getElementById(instance.params.id+'_text').innerHTML = title + instance.params.suffix
                  instance.animate(2 * Math.PI / 100 * instance.properties.curr - Math.PI / 2);
              } else {
                instance.params.onAnimationEnd();
                continue;
              }
            }
            if (instance.params.type == 'milestones') {
                instance.properties.frameTime = frameTime;
                var title = Math.ceil(instance.properties.curr % 100 / 100 * instance.params.milestonesCount);
                var titleContainer = document.getElementById(instance.params.id+'_text')
                var step = document.getElementById(instance.params.id+'_text').innerHTML;
                if (title.toString() !== step && title !== 0) {
                  document.getElementById(instance.params.id+'_text').innerHTML = title
                  instance.params.nextStep(title);
                }
                instance.animate(2 * Math.PI / 100 * instance.properties.curr - Math.PI / 2);
            }
        }
    });
};
