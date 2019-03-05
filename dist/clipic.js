(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, function () { 'use strict';

  var css = "\n.clipic-body {\n  background: #1c1c1c;\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  -webkit-transform: translate(0, 100%);\n      -ms-transform: translate(0, 100%);\n          transform: translate(0, 100%);\n  -webkit-transition: 0.4s;\n  -o-transition: 0.4s;\n  transition: 0.4s;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  z-index: 99;\n  overflow: hidden;\n}\n.clipic-body * {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.clipic-operation-bar {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  color: #f2f2f2;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n}\n.clipic-operation-bar [role=\"button\"] {\n  padding: 15px 20px;\n  font-size: 1em;\n}\n.clipic-frame {\n  background: #f2f2f2;\n  position: absolute;\n  left: 50%;\n  top: 30px;\n  transform: translateX(-50%);\n  transition: 0.3s;\n}\n.clipic-frame img {\n  -webkit-touch-callout: none;\n  pointer-events: none;\n}\n.clipic-frame-show {\n  overflow: hidden;\n}\n.clipic-cancel {\n  color: #3680fd;\n}\n.clipic-confirm{\n  color: #23c667;\n}\n.clipic-layer {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background: rgba(0,0,0,0.8);\n  pointer-events: none;\n}\n";

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
    function Clipic() {
      classCallCheck(this, Clipic);

      this.default = {
        width: 500, // 裁剪宽度
        height: 500, //裁剪高度
        src: '', // 需要裁剪的图片
        type: 'jpeg', // 裁剪后图片的类型，仅支持jpeg/png两种
        quality: 0.9 // 压缩质量
      };
      this.init(); // 初始化，渲染dom跟css
      this.clipic = this.getId('clipic');
      this.clipicImg1 = this.getId('clipicImg1'); // 背景图
      this.clipicImg2 = this.getId('clipicImg2'); // 前景图
      this.clipicFrame1 = this.getId('clipicFrame1'); // 背景操作框
      this.clipicFrame2 = this.getId('clipicFrame2'); // 前景操作框
      this.clipicCancel = this.getId('clipicCancel'); // 取消按钮
      this.clipicConfirm = this.getId('clipicConfirm'); // 完成按钮
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

        // 初始化参数
        this.scale = 1; // 缩放
        this.rotate = 0; // 旋转
        this.translateX = 0; // 水平偏移
        this.translateY = 0; // 垂直偏移
        this.options = Object.assign(this.default || {}, options);
        this.options.ratio = this.options.ratio || this.options.width / this.options.height;
        this.clipicImg2.crossOrigin = 'Anonymous';
        this.clipicImg1.src = this.options.src;
        this.clipicImg2.src = this.options.src;
        this.clipicImg2.onload = function () {
          _this.originW = _this.clipicImg2.width;
          _this.originH = _this.clipicImg2.height;
          _this.originRatio = _this.originW / _this.originH;
          _this.initSize();
          _this.clipic.style.transform = 'translate(0, 0)';
          _this.clipicCancel.addEventListener('click', function () {
            _this.cancel();
          });
          _this.clipicConfirm.addEventListener('click', function () {
            _this.done();
          });
          _this.clipicFrame2.addEventListener('dblclick', function () {
            console.log(_this.scale);
          });
          _this.clipicFrame2.addEventListener('touchmove', function (e) {
            if (e.touches.length > 1) {
              _this.setScale(e.touches[0], e.touches[1]);
              _this.setRotate(e.touches[0], e.touches[1]);
              return;
            }
            _this.setTranslate(e.touches[0]);
          });
          _this.clipicFrame2.addEventListener('touchend', function (e) {
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
        var cw = document.body.clientWidth - 60;
        var ch = document.body.clientHeight - 80;
        this.clipicFrame1.style.width = cw + 'px';
        this.clipicFrame1.style.height = cw / this.options.ratio + 'px';
        this.clipicFrame2.style.width = cw + 'px';
        this.clipicFrame2.style.height = cw / this.options.ratio + 'px';
        if (cw / this.options.ratio > ch) {
          this.clipicFrame1.style.height = ch + 'px';
          this.clipicFrame1.style.width = ch * this.options.ratio + 'px';
          this.clipicFrame2.style.height = ch + 'px';
          this.clipicFrame2.style.width = ch * this.options.ratio + 'px';
        }
        if (this.options.ratio > this.originRatio) {
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
        var zommRatio = this.options.width / this.clipicFrame2.clientWidth;
        var canvas = document.createElement('canvas');
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var w = void 0;
        var h = void 0;
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
        if (this.scale !== 0) {
          ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale));
          ctx.scale(this.scale, this.scale);
        }
        ctx.drawImage(this.clipicImg2, 0, 0, w, h);
        if (this.options.onDone) {
          this.options.onDone(canvas.toDataURL('image/' + this.options.type, this.options.quality));
        }
        if (this.options.onCancel) {
          this.options.onCancel();
        }
        this.cancel();
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
