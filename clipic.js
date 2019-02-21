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
      this.scaleX = 1;
      this.scaleY = 1;
      this.rotate = 0;
      this.init();
      this.clipicFrame = this.getId('clipicFrame');
      this.clipic = this.getId('clipic');
      this.clipicCancel = this.getId('clipicCancel');
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
        var css = '\n      .clipic-body {\n        background: #1c1c1c;\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transform: translate(0, 100%);\n        transition: 0.4s;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        box-sizing: border-box;\n      }\n      .clipic-body * {\n        box-sizing: border-box;\n      }\n      .clipic-operation-bar {\n        display: flex;\n        color: #f2f2f2;\n        justify-content: space-between;\n        position: absolute;\n        width: 100%;\n        bottom: 0;\n        left: 0;\n      }\n      .clipic-operation-bar [role="button"] {\n        padding: 15px 20px;\n        font-size: 1em;\n      }\n      .clipic-frame {\n        height: 300px;\n        margin: 30px;\n        background: #f2f2f2;\n        overflow: hidden;\n      }\n      .clipic-frame img {\n        transition: 1s;\n      }\n      .clipic-cancel {\n        color: #3680fd;\n      }\n      .clipic-confirm{\n        color: #23c667;\n      }\n    '.trim();
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

        var newOptions = options;
        if (this.options) {
          newOptions = Object.assign(this.options, options);
        }
        var clipicFrameW = newOptions.width || this.clipicFrame.clientWidth;
        var clipicFrameH = newOptions.height || this.clipicFrame.clientHeight;
        this.clipicFrame.style.height = this.clipicFrame.clientWidth / (clipicFrameW / clipicFrameH) + 'px';
        this.clipicImg.src = newOptions.src;
        this.clipic.style['transform'] = 'translate(0, 0)';
        setTimeout(function () {
          _this.setMiniSize();
        }, 400);
        this.clipicCancel.addEventListener('click', function () {
          _this.cancel();
        });
      }
    }, {
      key: 'setMiniSize',
      value: function setMiniSize() {
        var w = this.clipicFrame.clientWidth;
        var h = this.clipicFrame.clientHeight;
        var imgW = this.clipicImg.clientWidth;
        var imgH = this.clipicImg.clientHeight;
        if (imgH < h) {
          this.clipicImg.style.width = h * (imgW / imgH) + 'px';
          this.clipicImg.style.height = h + 'px';
        }
        if (imgW < w) {
          this.clipicImg.style.width = w + 'px';
          this.clipicImg.style.height = w * (imgW / imgH) + 'px';
        }
      }
    }, {
      key: 'cancel',
      value: function cancel() {
        this.clipic.style['transform'] = 'translate(0, 100%)';
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
