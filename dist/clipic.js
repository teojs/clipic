(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, function () { 'use strict';

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
      this.clipicFrame = this.getId('clipicFrame');
      this.clipic = this.getId('clipic');
      this.clipicCancel = this.getId('clipicCancel');
      this.clipicConfirm = this.getId('clipicConfirm');
      this.clipicImg = document.createElement('img');
      this.clipicFrame.appendChild(this.clipicImg);
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
        var css = '\n      .clipic-body {\n        background: #1c1c1c;\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transform: translate(0, 100%);\n        transition: 0.4s;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        box-sizing: border-box;\n        z-index: 99;\n      }\n      .clipic-body * {\n        box-sizing: border-box;\n      }\n      .clipic-operation-bar {\n        display: flex;\n        color: #f2f2f2;\n        justify-content: space-between;\n        position: absolute;\n        width: 100%;\n        bottom: 0;\n        left: 0;\n      }\n      .clipic-operation-bar [role="button"] {\n        padding: 15px 20px;\n        font-size: 1em;\n      }\n      .clipic-frame {\n        height: 300px;\n        margin: 30px;\n        background: #f2f2f2;\n        overflow: hidden;\n      }\n      .clipic-frame img {\n      }\n      .clipic-cancel {\n        color: #3680fd;\n      }\n      .clipic-confirm{\n        color: #23c667;\n      }\n    '.trim();
        style.innerHTML = css;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
      }
    }, {
      key: 'createHtml',
      value: function createHtml() {
        var div = document.createElement('div');
        div.className = 'clipic-body';
        div.setAttribute('id', 'clipic');
        var html = '\n      <div class="clipic-frame" id="clipicFrame"></div>\n      <div class="clipic-operation-bar">\n        <div class="clipic-cancel" id="clipicCancel" role="button">\u53D6\u6D88</div>\n        <div class="clipic-confirm" id="clipicConfirm" role="button">\u5B8C\u6210</div>\n      </div>\n    '.trim();
        div.innerHTML = html;
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
        this.newOptions = Object.assign(this.options || {}, options);
        this.newOptions.ratio = this.newOptions.ratio || this.newOptions.width / this.newOptions.height;
        this.clipicFrame.style.height = this.clipicFrame.clientWidth / this.newOptions.ratio + 'px';
        this.clipicImg.src = this.newOptions.src;
        this.clipicImg.onload = function () {
          _this.originW = _this.clipicImg.width;
          _this.originH = _this.clipicImg.height;
          _this.originRatio = _this.originW / _this.originH;
          _this.initSize();
          _this.clipic.style['transform'] = 'translate(0, 0)';
          _this.clipicCancel.addEventListener('click', function () {
            _this.cancel();
          });
          _this.clipicConfirm.addEventListener('click', function () {
            _this.done();
          });
          _this.clipicFrame.addEventListener('touchmove', function (e) {
            if (e.touches.length > 1) {
              _this.setScale(e.touches[0], e.touches[1]);
              _this.setRotate(e.touches[0], e.touches[1]);
              return;
            }
            _this.setTranslate(e.touches[0]);
          });
          _this.clipicFrame.addEventListener('touchend', function (e) {
            _this.distance = null;
            _this.angle = null;
            _this.moveX = null;
            _this.moveY = null;
          });
        };
      }
    }, {
      key: 'initSize',
      value: function initSize() {
        if (this.newOptions.ratio > this.originRatio) {
          this.clipicImg.style.width = this.clipicFrame.clientWidth + 'px';
        } else {
          this.clipicImg.style.height = this.clipicFrame.clientHeight + 'px';
        }
      }
    }, {
      key: 'setScale',
      value: function setScale(touches1, touches2) {
        var x = Math.abs(touches1.clientX - touches2.clientX);
        var y = Math.abs(touches1.clientY - touches2.clientY);
        var s = Math.sqrt(x * x + y * y);
        if (this.distance) {
          this.scale += (s - this.distance) / this.clipicImg.clientWidth;
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
      value: function setTranslate(touches1, touches2) {
        var x = touches1.clientX;
        var y = touches1.clientY;
        if (this.moveX) {
          this.translateX += x - this.moveX;
        }
        if (this.moveY) {
          this.translateY += y - this.moveY;
        }
        this.moveX = x;
        this.moveY = y;
        this.setTransform();
      }
    }, {
      key: 'setTransform',
      value: function setTransform() {
        this.clipicImg.style['transform'] = 'translate(' + this.translateX + 'px, ' + this.translateY + 'px) scale(' + this.scale + ') rotate(' + this.rotate + 'deg)';
      }
    }, {
      key: 'cancel',
      value: function cancel() {
        var _this2 = this;

        this.clipic.style['transform'] = 'translate(0, 100%)';
        setTimeout(function () {
          _this2.clipicImg.style = '';
          _this2.clipicImg.src = '';
        }, 400);
      }
    }, {
      key: 'done',
      value: function done() {
        var point = { x: this.newOptions.width / 2, y: this.newOptions.height / 2 };
        var canvas = document.createElement('canvas');
        canvas.width = this.newOptions.width;
        canvas.height = this.newOptions.height;
        var ctx = canvas.getContext('2d');
        ctx.translate(this.translateX + point.x * (1 - this.scale), this.translateY + point.y * (1 - this.scale));
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.scale(this.scale, this.scale);
        var w = void 0;
        var h = void 0;
        if (this.newOptions.ratio > this.originRatio) {
          w = this.newOptions.width;
          h = this.originH / (this.newOptions.width / this.originW);
        } else {
          h = this.newOptions.height;
          w = this.originW * (this.newOptions.height / this.originH);
        }
        ctx.drawImage(this.clipicImg, 0, 0, w, h);
        this.newOptions.onDone(canvas);
        this.cancel();
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
