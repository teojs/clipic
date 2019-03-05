(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, function () { 'use strict';

  var css = "\n.clipic-body {\n  background: #1c1c1c;\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-transform: translate(0, 100%);\n      -ms-transform: translate(0, 100%);\n          transform: translate(0, 100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  z-index: 99;\n}\n.clipic-body * {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.clipic-operation-bar {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  color: #f2f2f2;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n}\n.clipic-operation-bar [role=\"button\"] {\n  padding: 15px 20px;\n  font-size: 1em;\n}\n.clipic-frame {\n  width: calc(100% - 60px);\n  height: 300px;\n  margin: 30px;\n  background: #f2f2f2;\n  position: absolute;\n}\n.clipic-frame img {\n  -webkit-touch-callout: none;\n  pointer-events: none;\n  -webkit-filter: blur(2px);\n          filter: blur(2px);\n}\n.clipic-frame-show {\n  overflow: hidden;\n}\n.clipic-frame-show img {\n  -webkit-filter: blur(0);\n          filter: blur(0);\n}\n.clipic-cancel {\n  color: #3680fd;\n}\n.clipic-confirm{\n  color: #23c667;\n}\n.clipic-layer {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background: rgba(0,0,0,0.5);\n  pointer-events: none;\n}\n";

  var dom = "\n    <div class=\"clipic-frame\" id=\"clipicFrame1\"><img id=\"clipicImg1\"></div>\n    <div class=\"clipic-layer\"></div>\n    <div class=\"clipic-frame clipic-frame-show\" id=\"clipicFrame2\"><img id=\"clipicImg2\"></div>\n    <div class=\"clipic-operation-bar\">\n      <div class=\"clipic-cancel\" id=\"clipicCancel\" role=\"button\">\u53D6\u6D88</div>\n      <div class=\"clipic-confirm\" id=\"clipicConfirm\" role=\"button\">\u5B8C\u6210</div>\n    </div>\n  ";

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Clipic = function () {
    function Clipic(options) {
      classCallCheck(this, Clipic);

      this.options = options;
      this.init();
      this.clipicFrame1 = this.getId('clipicFrame1');
      this.clipicFrame2 = this.getId('clipicFrame2');
      this.clipicImg1 = this.getId('clipicImg1');
      this.clipicImg2 = this.getId('clipicImg2');
      this.clipic = this.getId('clipic');
      this.clipicCancel = this.getId('clipicCancel');
      this.clipicConfirm = this.getId('clipicConfirm');
    }

    createClass(Clipic, [{
      key: 'init',
      value: function init() {
        this.createStyle();
        this.createHtml();
      }
    }, {
      key: 'getId',
      value: function getId(id) {
        return document.getElementById(id);
      }
    }, {
      key: 'createStyle',
      value: function createStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
      }
    }, {
      key: 'createHtml',
      value: function createHtml() {
        var div = document.createElement('div');
        div.className = 'clipic-body';
        div.setAttribute('id', 'clipic');
        div.innerHTML = dom;
        document.body.appendChild(div);
      }
    }, {
      key: 'getImage',
      value: function getImage() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.scale = 1;
        this.rotate = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.touchStartTime = 0;
        this.touchEndTime = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.scrollTimes = [];
        this.newOptions = Object.assign(this.options || {}, options);
        this.newOptions.ratio = this.newOptions.ratio || this.newOptions.width / this.newOptions.height;
        this.clipicFrame2.style.height = this.clipicFrame2.clientWidth / this.newOptions.ratio + 'px';
        this.clipicImg1.src = this.newOptions.src;
        this.clipicImg2.src = this.newOptions.src;
        this.clipicImg2.onload = function () {
          _this.originW = _this.clipicImg2.width;
          _this.originH = _this.clipicImg2.height;
          _this.originRatio = _this.originW / _this.originH;
          _this.initSize();
          _this.clipic.style['transform'] = 'translate(0, 0)';
          _this.clipicCancel.addEventListener('click', function () {
            _this.cancel();
          });
          _this.clipicConfirm.addEventListener('click', function () {
            _this.done();
          });
          _this.clipicFrame2.addEventListener('dblclick', function () {
            console.log(_this.scale);
          });
          _this.clipicFrame2.addEventListener('touchstart', function (e) {
            _this.touchStartX = e.touches[0].clientX;
            _this.touchStartY = e.touches[0].clientY;
            clearTimeout(_this.ST);
          });
          _this.clipicFrame2.addEventListener('touchmove', function (e) {
            _this.scrollTimes.push(e.timeStamp);
            if (e.touches.length > 1) {
              _this.setScale(e.touches[0], e.touches[1]);
              _this.setRotate(e.touches[0], e.touches[1]);
              return;
            }
            _this.setTranslate(e.touches[0]);
            _this.scrollX = e.touches[0].clientX - _this.touchStartX;
            _this.scrollY = e.touches[0].clientY - _this.touchStartY;
            _this.touchStartTime = Date.now();
            _this.touchStartX = e.touches[0].clientX;
            _this.touchStartY = e.touches[0].clientY;
          });
          _this.clipicFrame2.addEventListener('touchend', function (e) {
            _this.distance = null;
            _this.angle = null;
            _this.moveX = null;
            _this.moveY = null;
            _this.touchEndTime = Date.now();
            _this.scrollTimes.push(e.timeStamp);
            // this.scroll(e.changedTouches[0])
          });
        };
      }
    }, {
      key: 'initSize',
      value: function initSize() {
        if (this.newOptions.ratio > this.originRatio) {
          this.clipicImg1.style.width = this.clipicFrame2.clientWidth + 'px';
          this.clipicImg2.style.width = this.clipicFrame2.clientWidth + 'px';
        } else {
          this.clipicImg1.style.height = this.clipicFrame2.clientHeight + 'px';
          this.clipicImg2.style.height = this.clipicFrame2.clientHeight + 'px';
        }
      }
    }, {
      key: 'setScale',
      value: function setScale(touches1, touches2) {
        var x = Math.abs(touches1.clientX - touches2.clientX);
        var y = Math.abs(touches1.clientY - touches2.clientY);
        var s = Math.sqrt(x * x + y * y);
        if (this.distance) {
          this.scale += (s - this.distance) / this.clipicImg2.clientWidth;
          this.setTransform();
        }
        this.distance = s;
      }
    }, {
      key: 'setRotate',
      value: function setRotate(touches1, touches2) {
        var x = touches1.clientX - touches2.clientX;
        var y = touches1.clientY - touches2.clientY;
        var angle = Math.atan2(y, x) * 180 / Math.PI;
        if (this.angle) {
          this.rotate += angle - this.angle;
          this.setTransform();
        }
        this.angle = angle;
      }
    }, {
      key: 'setTranslate',
      value: function setTranslate(touches) {
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
        // if (this.translateX > 0) {
        //   this.translateX = 0
        // }
        // if (this.translateY > 0) {
        //   this.translateY = 0
        // }
        this.setTransform();
      }
    }, {
      key: 'setTransform',
      value: function setTransform() {
        var transform = 'translate(' + this.translateX + 'px, ' + this.translateY + 'px) scale(' + this.scale + ') rotate(' + this.rotate + 'deg)';
        this.clipicImg1.style.transform = transform;
        this.clipicImg2.style.transform = transform;
      }
    }, {
      key: 'cancel',
      value: function cancel() {
        var _this2 = this;

        this.clipic.style.transform = 'translate(0, 100%)';
        setTimeout(function () {
          _this2.clipicImg1.style = '';
          _this2.clipicImg1.src = '';
          _this2.clipicImg2.style = '';
          _this2.clipicImg2.src = '';
        }, 400);
      }
    }, {
      key: 'done',
      value: function done() {
        var zommRatio = this.newOptions.width / this.clipicFrame2.clientWidth;
        var canvas = document.createElement('canvas');
        canvas.width = this.newOptions.width;
        canvas.height = this.newOptions.height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var w = void 0;
        var h = void 0;
        if (this.newOptions.ratio > this.originRatio) {
          w = this.newOptions.width;
          h = this.originH / (this.originW / this.newOptions.width);
        } else {
          h = this.newOptions.height;
          w = this.originW / (this.originH / this.newOptions.height);
        }
        var point = { x: w / 2, y: h / 2 };
        ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio);
        if (this.rotate !== 0) {
          ctx.translate(point.x, point.y);
          ctx.rotate(this.rotate * Math.PI / 180);
          ctx.translate(-point.x, -point.y);
        }
        if (this.scale !== 0) {
          ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale));
          ctx.scale(this.scale, this.scale);
        }
        ctx.drawImage(this.clipicImg2, 0, 0, w, h);
        this.newOptions.onDone(canvas.toDataURL('image/jpeg', 0.8));
        this.cancel();
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
