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
        var css = '\n      .clipic-body {\n        background: #1c1c1c;\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transform: translate(0, 100%);\n        transition: 0.4s;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        box-sizing: border-box;\n      }\n      .clipic-body * {\n        box-sizing: border-box;\n      }\n      .clipic-operation-bar {\n        display: flex;\n        color: #f2f2f2;\n        justify-content: space-between;\n        position: absolute;\n        width: 100%;\n        bottom: 0;\n        left: 0;\n      }\n      .clipic-operation-bar [role="button"] {\n        padding: 15px 20px;\n        font-size: 1em;\n      }\n      .clipic-frame {\n        height: 300px;\n        margin: 30px;\n        background: #f2f2f2;\n        overflow: hidden;\n      }\n      .clipic-frame img {\n        transition: transform 0.5s linear;\n      }\n      .clipic-cancel {\n        color: #3680fd;\n      }\n      .clipic-confirm{\n        color: #23c667;\n      }\n    '.trim();
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
        };
      }
    }, {
      key: 'initSize',
      value: function initSize() {
        // var w = this.clipicFrame.clientWidth
        // var h = this.clipicFrame.clientHeight
        // this.clipicImg.style.width = w + 'px'
        // this.clipicImg.style.height = w / (this.originW / this.originH) + 'px'
        // var imgW = this.clipicImg.clientWidth
        // var imgH = this.clipicImg.clientHeight
        // if (imgH < h) {
        //   this.clipicImg.style.height = h + 'px'
        //   this.clipicImg.style.width = h * (imgW / imgH) + 'px'
        // }
        // imgW = this.clipicImg.clientWidth
        // imgH = this.clipicImg.clientHeight
        // console.log(w, h, imgW, imgH)
        // if (imgW > w) {
        //   this.clipicImg.style['transform'] = `translate(-${(imgW - w) / 2}px, 0)`
        // }
        // if (imgW > w) {
        //   this.clipicImg.style['transform'] = `translate(-${(imgW - w) / 2}px, 0)`
        // }
        if (this.newOptions.ratio > this.originRatio) {
          this.clipicImg.style.width = this.clipicFrame.clientWidth + 'px';
          this.clipicImg.style['transform'] = 'translate(0, -' + (this.clipicImg.clientHeight - this.clipicFrame.clientHeight) / 2 + 'px)';
        } else {
          this.clipicImg.style.height = this.clipicFrame.clientHeight + 'px';
          this.clipicImg.style['transform'] = 'translate(-' + (this.clipicImg.clientWidth - this.clipicFrame.clientWidth) / 2 + 'px, 0)';
        }
      }
    }, {
      key: 'cancel',
      value: function cancel() {
        this.clipic.style['transform'] = 'translate(0, 100%)';
        this.clipicImg.style = '';
        this.clipicImg.src = '';
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
