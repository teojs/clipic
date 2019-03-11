(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, function () { 'use strict';

  var css = "\n.clipic-body {\n  background: #1c1c1c;\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-transform: translate(0, 100%);\n      -ms-transform: translate(0, 100%);\n          transform: translate(0, 100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  z-index: 99;\n  overflow: hidden;\n}\n.clipic-body * {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.clipic-operation-bar {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  color: #f2f2f2;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n}\n.clipic-operation-bar [role=\"button\"] {\n  padding: 15px 20px;\n  font-size: 1em;\n}\n.clipic-frame {\n  background: #f2f2f2;\n  position: absolute;\n  left: 50%;\n  top: 30px;\n  transform: translateX(-50%);\n  transition: 0.3s;\n}\n.clipic-frame img {\n  -webkit-touch-callout: none;\n  pointer-events: none;\n}\n.clipic-frame-show {\n  overflow: hidden;\n}\n.clipic-cancel {\n  color: #e04c4c;\n}\n.clipic-reset{\n  color: #3680fd;\n}\n.clipic-confirm{\n  color: #23c667;\n}\n.clipic-layer {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background: rgba(0,0,0,0.8);\n  pointer-events: none;\n  transform: translate3D(0,0,0);\n}\n";

  var dom = "\n    <div class=\"clipic-frame\" id=\"clipicFrame1\"><img id=\"clipicImg1\"></div>\n    <div class=\"clipic-layer\"></div>\n    <div class=\"clipic-frame clipic-frame-show\" id=\"clipicFrame2\"><img id=\"clipicImg2\"></div>\n    <div class=\"clipic-operation-bar\">\n      <div class=\"clipic-cancel\" id=\"clipicCancel\" role=\"button\">\u53D6\u6D88</div>\n      <div class=\"clipic-reset\" id=\"clipicReset\" role=\"button\">\u91CD\u7F6E</div>\n      <div class=\"clipic-confirm\" id=\"clipicConfirm\" role=\"button\">\u5B8C\u6210</div>\n    </div>\n  ";

  var Clipic = /** @class */function () {
      function Clipic() {
          this["default"] = {
              width: 500,
              height: 500,
              src: '',
              type: 'jpeg',
              quality: 0.9,
              buttonText: ['取消', '重置', '完成'] // 底部三个按钮文案
          };
          this.init(); // 初始化，渲染dom跟css
          this.clipic = this.getId('clipic');
          this.img1 = this.getId('clipicImg1'); // 背景图
          this.img2 = this.getId('clipicImg2'); // 前景图
          this.frame1 = this.getId('clipicFrame1'); // 背景操作框
          this.frame2 = this.getId('clipicFrame2'); // 前景操作框
          this.cancelBtn = this.getId('clipicCancel'); // 取消按钮
          this.resetBtn = this.getId('clipicReset'); // 重置按钮
          this.confirmBtn = this.getId('clipicConfirm'); // 完成按钮
      }
      Clipic.prototype.init = function () {
          if (!this.getId('clipic')) {
              this.createStyle();
              this.createHtml();
          }
      };
      Clipic.prototype.getId = function (id) {
          return document.getElementById(id);
      };
      Clipic.prototype.createStyle = function () {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css;
          document.getElementsByTagName('HEAD').item(0).appendChild(style);
      };
      Clipic.prototype.createHtml = function () {
          var div = document.createElement('div');
          div.className = 'clipic-body';
          div.setAttribute('id', 'clipic');
          div.innerHTML = dom;
          document.body.appendChild(div);
      };
      Clipic.prototype.getImage = function (options) {
          var _this = this;
          // 初始化参数
          this.scale = 1;
          this.rotate = 0;
          this.translateX = 0;
          this.translateY = 0;
          this.options = Object.assign(this["default"], options);
          this.cancelBtn.innerHTML = this.options.buttonText[0];
          this.resetBtn.innerHTML = this.options.buttonText[1];
          this.confirmBtn.innerHTML = this.options.buttonText[2];
          this.options.ratio = this.options.ratio || this.options.width / this.options.height;
          this.img2.setAttribute('crossOrigin', 'Anonymous');
          this.img1.setAttribute('src', this.options.src);
          this.img2.setAttribute('src', this.options.src);
          this.img2.onload = function () {
              _this.originW = _this.img2['width'];
              _this.originH = _this.img2['height'];
              _this.originRatio = _this.originW / _this.originH;
              _this.initSize();
              _this.clipic.style.transform = 'translate(0, 0)';
              _this.cancelBtn.addEventListener('click', function () {
                  _this.cancel();
              });
              _this.resetBtn.addEventListener('click', function () {
                  _this.reset();
              });
              _this.confirmBtn.addEventListener('click', function () {
                  _this.done();
              });
              _this.frame2.addEventListener('touchmove', function (e) {
                  e.preventDefault();
                  if (e.touches.length > 1) {
                      _this.setScale(e.touches[0], e.touches[1]);
                      _this.setRotate(e.touches[0], e.touches[1]);
                      return;
                  }
                  _this.setTranslate(e.touches[0]);
              });
              _this.frame2.addEventListener('touchend', function (e) {
                  _this.distance = null;
                  _this.angle = null;
                  _this.moveX = null;
                  _this.moveY = null;
              });
          };
      };
      Clipic.prototype.initSize = function () {
          var cw = document.body.clientWidth - 60;
          var ch = document.body.clientHeight - 80;
          this.frame1.style.width = cw + 'px';
          this.frame1.style.height = cw / this.options.ratio + 'px';
          this.frame2.style.width = cw + 'px';
          this.frame2.style.height = cw / this.options.ratio + 'px';
          if (cw / this.options.ratio > ch) {
              this.frame1.style.height = ch + 'px';
              this.frame1.style.width = ch * this.options.ratio + 'px';
              this.frame2.style.height = ch + 'px';
              this.frame2.style.width = ch * this.options.ratio + 'px';
          }
          if (this.options.ratio > this.originRatio) {
              this.img1.style.width = this.frame2.clientWidth + 'px';
              this.img2.style.width = this.frame2.clientWidth + 'px';
          } else {
              this.img1.style.height = this.frame2.clientHeight + 'px';
              this.img2.style.height = this.frame2.clientHeight + 'px';
          }
      };
      Clipic.prototype.setScale = function (touches1, touches2) {
          var x = Math.abs(touches1.clientX - touches2.clientX);
          var y = Math.abs(touches1.clientY - touches2.clientY);
          var s = Math.sqrt(x * x + y * y);
          if (this.distance) {
              this.scale += (s - this.distance) / this.img2.clientWidth;
              this.setTransform();
          }
          this.distance = s;
      };
      Clipic.prototype.setRotate = function (touches1, touches2) {
          var x = touches1.clientX - touches2.clientX;
          var y = touches1.clientY - touches2.clientY;
          var angle = Math.atan2(y, x) * 180 / Math.PI;
          if (this.angle) {
              this.rotate += angle - this.angle;
              this.setTransform();
          }
          this.angle = angle;
      };
      Clipic.prototype.setTranslate = function (touches) {
          var x = touches.clientX;
          var y = touches.clientY;
          if (this.moveX) {
              this.translateX += x - this.moveX;
          }
          if (this.moveY) {
              this.translateY += y - this.moveY;
          }
          this.moveX = x;
          this.moveY = y;
          this.setTransform();
      };
      Clipic.prototype.setTransform = function () {
          var transform = "translate(" + this.translateX + "px, " + this.translateY + "px) scale(" + this.scale + ") rotate(" + this.rotate + "deg)";
          this.img1.style.transform = transform;
          this.img2.style.transform = transform;
      };
      Clipic.prototype.cancel = function () {
          var _this = this;
          this.clipic.style.transform = 'translate(0, 100%)';
          setTimeout(function () {
              _this.img1.setAttribute('style', '');
              _this.img1.setAttribute('src', '');
              _this.img2.setAttribute('style', '');
              _this.img2.setAttribute('src', '');
          }, 400);
      };
      Clipic.prototype.reset = function () {
          var _this = this;
          this.scale = 1;
          this.rotate = 0;
          this.translateX = 0;
          this.translateY = 0;
          this.img1.style.transition = '0.3s';
          this.img2.style.transition = '0.3s';
          this.setTransform();
          setTimeout(function () {
              _this.img1.style.transition = '';
              _this.img2.style.transition = '';
          }, 300);
      };
      Clipic.prototype.done = function () {
          var zommRatio = this.options.width / this.frame2.clientWidth;
          var canvas = document.createElement('canvas');
          canvas.width = this.options.width;
          canvas.height = this.options.height;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var w;
          var h;
          if (this.options.ratio > this.originRatio) {
              w = this.options.width;
              h = this.originH / (this.originW / this.options.width);
          } else {
              h = this.options.height;
              w = this.originW / (this.originH / this.options.height);
          }
          var point = { x: w / 2, y: h / 2 };
          ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio);
          if (this.rotate !== 0) {
              ctx.translate(point.x, point.y);
              ctx.rotate(this.rotate * Math.PI / 180);
              ctx.translate(-point.x, -point.y);
          }
          if (this.scale !== 1) {
              ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale));
              ctx.scale(this.scale, this.scale);
          }
          ctx.drawImage(this.img2, 0, 0, w, h);
          if (this.options.onDone) {
              this.options.onDone(canvas.toDataURL("image/" + this.options.type, this.options.quality));
          }
          if (this.options.onCancel) {
              this.options.onCancel();
          }
          this.cancel();
      };
      return Clipic;
  }();

  return Clipic;

}));
