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
    }

    createClass(Clipic, [{
      key: 'init',
      value: function init() {
        this.createStyle();
        this.createHtml();
      }
    }, {
      key: 'createStyle',
      value: function createStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';
        var css = '\n      .clipic-body {\n        background: #1c1c1c;\n        position: fixed;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        transform: translate(0, 100%);\n        transition: transform 0.4s;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        box-sizing: border-box;\n      }\n      .clipic-body * {\n        box-sizing: border-box;\n      }\n      .clipic-operation-bar {\n        display: flex;\n        color: #f2f2f2;\n        justify-content: space-between;\n        position: absolute;\n        width: 100%;\n        bottom: 0;\n        left: 0;\n      }\n      .clipic-operation-bar [role="button"] {\n        padding: 15px 20px;\n        font-size: 1.2em;\n      }\n      .clipic-frame {\n        height: 300px;\n        margin: 30px;\n        background: #f2f2f2;\n      }\n      .clipic-frame img {\n        width: 100%;\n      }\n      .clipic-cancel {\n        color: #3680fd;\n      }\n      .clipic-confirm{\n        color: #23c667;\n      }\n    '.trim();
        style.innerHTML = css;
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
      }
    }, {
      key: 'createHtml',
      value: function createHtml() {
        var div = document.createElement('div');
        div.className = 'clipic-body';
        div.setAttribute('id', 'clipic');
        var html = '\n      <div class="clipic-frame" id="clipicFrame"></div>\n      <div class="clipic-operation-bar">\n        <div class="clipic-cancel" role="button">\u53D6\u6D88</div>\n        <div class="clipic-confirm" role="button">\u5B8C\u6210</div>\n      </div>\n    '.trim();
        div.innerHTML = html;
        document.body.appendChild(div);
      }
    }, {
      key: 'getImage',
      value: function getImage() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var newOptions = options;
        if (this.options) {
          newOptions = Object.assign(this.options, options);
        }
        var clipicFrame = document.getElementById('clipicFrame');
        var clipicFrameW = newOptions.width || clipicFrame.clientWidth;
        var clipicFrameH = newOptions.height || clipicFrame.clientHeight;
        clipicFrame.style.height = clipicFrame.clientWidth / (clipicFrameW / clipicFrameH) + 'px';
        var img = document.createElement('img');
        img.src = newOptions.src;
        clipicFrame.appendChild(img);
        var clipic = document.getElementById('clipic');
        clipic.style['transform'] = 'translate(0, 0)';
      }
    }]);
    return Clipic;
  }();

  return Clipic;

}));
