(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Breath = factory());
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

  var Breath = function () {
    function Breath() {
      classCallCheck(this, Breath);
    }

    createClass(Breath, [{
      key: 'init',
      value: function init() {
        var _this = this;

        var el = document.body.querySelectorAll('*');
        el.forEach(function (el, i) {
          if (el.dataset.breath) {
            _this.doAnimation(el);
          }
        });
      }
    }, {
      key: 'doAnimation',
      value: function doAnimation(el) {
        var data = el.dataset.breath.split(';');
        var transform = '';
        var duration = 1500;
        var timing = 'linear';
        var origin = '50% 50% 0';
        data.forEach(function (o) {
          switch (true) {
            case /scale/.test(o):
              transform += o + '';
              break;
            case /rotate/.test(o):
              transform += o + '';
              break;
            case /translate/.test(o):
              transform += o + '';
              break;
            case /skew/.test(o):
              transform += o + '';
              break;
            case /duration/.test(o):
              duration = /[^()]+(?=\))/.exec(o)[0];
              break;
            case /timing/.test(o):
              timing = /[^()]+(?=\))/.exec(o)[0];
              break;
            case /origin/.test(o):
              origin = /[^()]+(?=\))/.exec(o)[0];
              break;
          }
        });
        var transition = 'transform ' + timing + ' ' + duration / 1000 + 's';
        el.style['transition'] = transition;
        el.style['-ms-transition'] = transition;
        el.style['-webkit-transition'] = transition;
        el.style['-o-transition'] = transition;
        el.style['-moz-transition'] = transition;

        el.style['transform-origin'] = origin;
        el.style['-ms-transform-origin'] = origin;
        el.style['-webkit-transform-origin'] = origin;
        el.style['-o-transform-origin'] = origin;
        el.style['-moz-transform-origin'] = origin;
        setInterval(function () {
          if (el.style.transform) {
            el.style['transform'] = '';
            el.style['-ms-transform'] = '';
            el.style['-webkit-transform'] = '';
            el.style['-o-transform'] = '';
            el.style['-moz-transform'] = '';
          } else {
            el.style['transform'] = transform;
            el.style['-ms-transform'] = transform;
            el.style['-webkit-transform'] = transform;
            el.style['-o-transform'] = transform;
            el.style['-moz-transform'] = transform;
          }
        }, duration);
      }
    }]);
    return Breath;
  }();

  return Breath;

}));
