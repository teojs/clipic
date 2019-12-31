(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".clipic-body{background:#1c1c1c;position:fixed;width:100%;height:100%;top:0;left:0;-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%);-webkit-transition:.4s;-o-transition:.4s;transition:.4s;-webkit-touch-callout:none;-webkit-user-select:none;z-index:9999;overflow:hidden}.clipic-body,.clipic-body *{-webkit-box-sizing:border-box;box-sizing:border-box}.clipic-layer{background:rgba(0,0,0,.7);pointer-events:none;transform:translateZ(0)}.clipic-layer__top{height:30px;position:relative;z-index:10}.clipic-layer__center{display:flex;align-items:stretch;justify-content:space-between}.clipic-frame{background:#f2f2f2;position:relative;z-index:1}.clipic-layer__left,.clipic-layer__right{min-width:30px;flex-shrink:1;flex:1;position:relative;z-index:10}.clipic-layer__bottom{height:100%;position:relative;z-index:10}.clipic-operation-bar{display:-webkit-box;display:-ms-flexbox;display:flex;color:#f2f2f2;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;position:absolute;width:100%;bottom:0;left:0;z-index:11}.clipic-operation-bar [role=button]{padding:15px 20px;font-size:1em}.clipic-frame img{-webkit-touch-callout:none;pointer-events:none}.clipic-cancel{color:#e04c4c}.clipic-reset{color:#3680fd}.clipic-confirm{color:#23c667}";
  styleInject(css);

  var dom = "\n    <div class=\"clipic-layer clipic-layer__top\"></div>\n    <div class=\"clipic-layer__center\">\n      <div class=\"clipic-layer clipic-layer__left\"></div>\n      <div class=\"clipic-frame\" id=\"clipicFrame\">\n        <img id=\"clipicImg\" crossOrigin=\"Anonymous\">\n      </div>\n      <div class=\"clipic-layer clipic-layer__right\"></div>\n    </div>\n    <div class=\"clipic-layer clipic-layer__bottom\"></div>\n    <div class=\"clipic-operation-bar\">\n      <div class=\"clipic-cancel\" id=\"clipicCancel\" role=\"button\">\u53D6\u6D88</div>\n      <div class=\"clipic-reset\" id=\"clipicReset\" role=\"button\">\u91CD\u7F6E</div>\n      <div class=\"clipic-confirm\" id=\"clipicConfirm\" role=\"button\">\u5B8C\u6210</div>\n    </div>\n  ";

  var Clipic = /** @class */function () {
      function Clipic() {
          this.defaults = {
              width: 500,
              height: 500,
              radio: '',
              src: '',
              encode: 'base64',
              type: 'jpeg',
              name: 'clipic',
              quality: 0.9,
              buttonText: ['取消', '重置', '完成'] // 底部三个按钮文案
          };
          this.createHtml();
          this.clipic = this.getId('clipic');
          this.img = this.getId('clipicImg'); // 裁剪预览图
          this.frame = this.getId('clipicFrame'); // 背景操作框
          this.cancelBtn = this.getId('clipicCancel'); // 取消按钮
          this.resetBtn = this.getId('clipicReset'); // 重置按钮
          this.confirmBtn = this.getId('clipicConfirm'); // 完成按钮
      }
      Clipic.prototype.getId = function (id) {
          return document.getElementById(id);
      };
      Clipic.prototype.createHtml = function () {
          if (!this.getId('clipic')) {
              var div = document.createElement('div');
              div.className = 'clipic-body';
              div.setAttribute('id', 'clipic');
              div.innerHTML = dom;
              document.body.appendChild(div);
          }
      };
      Clipic.prototype.getImage = function (options) {
          var _this = this;
          // 初始化参数
          this.scale = 1; // 缩放
          this.rotate = 0; // 旋转
          this.translateX = 0; // 水平偏移
          this.translateY = 0; // 垂直偏移
          var defaults = JSON.parse(JSON.stringify(this.defaults));
          this.options = Object.assign(defaults, options);
          this.cancelBtn.innerHTML = this.options.buttonText[0];
          this.resetBtn.innerHTML = this.options.buttonText[1];
          this.confirmBtn.innerHTML = this.options.buttonText[2];
          this.img.src = this.options.src;
          var tempImage = new Image();
          tempImage.onload = function () {
              _this.originW = _this.img.width;
              _this.originH = _this.img.height;
              if (_this.options.ratio) {
                  _this.options.width = _this.img.width;
                  _this.options.height = _this.img.width / _this.options.ratio;
              } else {
                  _this.options.ratio = _this.options.width / _this.options.height;
              }
              _this.originRatio = _this.originW / _this.originH;
              _this.initSize();
              _this.clipic.style.transform = 'translate(0, 0)';
              setTimeout(function () {
                  if (_this.options.ratio > _this.originRatio) {
                      _this.img.style.width = _this.frame.clientWidth + 'px';
                  } else {
                      _this.img.style.height = _this.frame.clientHeight + 'px';
                  }
              }, 300);
              _this.setTransform();
              _this.cancelBtn.addEventListener('click', _this.cancel.bind(_this));
              _this.resetBtn.addEventListener('click', _this.reset.bind(_this));
              _this.confirmBtn.addEventListener('click', _this.done.bind(_this));
              _this.clipic.addEventListener('touchmove', function (e) {
                  e.preventDefault();
                  if (e.touches.length > 1) {
                      _this.setScale(e.touches[0], e.touches[1]);
                      _this.setRotate(e.touches[0], e.touches[1]);
                      return;
                  }
                  _this.setTranslate(e.touches[0]);
              });
              _this.clipic.addEventListener('touchend', function (e) {
                  _this.distance = null;
                  _this.angle = null;
                  _this.moveX = null;
                  _this.moveY = null;
              });
          };
          tempImage.src = this.options.src;
      };
      Clipic.prototype.initSize = function () {
          var cw = document.body.clientWidth - 60;
          var ch = document.body.clientHeight - 80;
          this.frame.style.width = cw + 'px';
          this.frame.style.height = cw / this.options.ratio + 'px';
          if (cw / this.options.ratio > ch) {
              this.frame.style.height = ch + 'px';
              this.frame.style.width = ch * this.options.ratio + 'px';
          }
          if (this.options.ratio > this.originRatio) {
              this.img.style.width = this.frame.clientWidth + 'px';
          } else {
              this.img.style.height = this.frame.clientHeight + 'px';
          }
      };
      Clipic.prototype.setScale = function (touches1, touches2) {
          var x = Math.abs(touches1.clientX - touches2.clientX);
          var y = Math.abs(touches1.clientY - touches2.clientY);
          var s = Math.sqrt(x * x + y * y);
          if (this.distance) {
              this.scale += (s - this.distance) / this.img.clientWidth;
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
          this.img.style.transform = transform;
      };
      Clipic.prototype.cancel = function (eventType) {
          var _this = this;
          this.clipic.style.transform = 'translate(0, 100%)';
          setTimeout(function () {
              _this.img.removeAttribute('style');
              _this.img.removeAttribute('src');
          }, 400);
          if (this.options.onCancel && eventType !== 'done') {
              this.options.onCancel();
          }
          this.cancelBtn.removeEventListener('click', this.cancel.bind(this));
          this.resetBtn.removeEventListener('click', this.reset.bind(this));
          this.confirmBtn.removeEventListener('click', this.done.bind(this), true);
      };
      Clipic.prototype.reset = function () {
          var _this = this;
          this.scale = 1;
          this.rotate = 0;
          this.translateX = 0;
          this.translateY = 0;
          this.img.style.transition = '0.3s';
          this.setTransform();
          setTimeout(function () {
              _this.img.style.transition = '';
          }, 300);
      };
      Clipic.prototype.done = function () {
          var _this = this;
          var zommRatio = this.options.width / this.frame.clientWidth;
          var canvas = document.createElement('canvas');
          canvas.width = this.options.width;
          canvas.height = this.options.height;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var drawImageW;
          var drawImageH;
          if (this.options.ratio > this.originRatio) {
              drawImageW = this.options.width;
              drawImageH = this.originH / (this.originW / this.options.width);
          } else {
              drawImageH = this.options.height;
              drawImageW = this.originW / (this.originH / this.options.height);
          }
          var point = { x: drawImageW / 2, y: drawImageH / 2 };
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
          ctx.drawImage(this.img, 0, 0, drawImageW, drawImageH);
          if (this.options.onDone) {
              switch (this.options.encode) {
                  case 'base64':
                      this.options.onDone(canvas.toDataURL("image/" + this.options.type, this.options.quality));
                      break;
                  case 'blob':
                      canvas.toBlob(function (blob) {
                          _this.options.onDone(blob);
                      }, "image/" + this.options.type);
                      break;
                  case 'file':
                      canvas.toBlob(function (blob) {
                          var file = new window.File([blob], _this.options.name, { type: "image/" + _this.options.type });
                          _this.options.onDone(file);
                      }, "image/" + this.options.type);
                      break;
                  default:
                      this.options.onDone(canvas.toDataURL("image/" + this.options.type, this.options.quality));
                      break;
              }
          }
          this.cancel('done');
      };
      return Clipic;
  }();

  return Clipic;

}));
