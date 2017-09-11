(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _root = require("./src/component/root");

var _root2 = _interopRequireDefault(_root);

var _button = require("./src/component/button");

var _button2 = _interopRequireDefault(_button);

var _window = require("./src/component/window");

var _window2 = _interopRequireDefault(_window);

var _route = require("./src/component/route");

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('x-root', _root2.default);
customElements.define('x-button', _button2.default);
customElements.define('x-window', _window2.default);
customElements.define('x-route', _route2.default);

},{"./src/component/button":3,"./src/component/root":4,"./src/component/route":5,"./src/component/window":6}],2:[function(require,module,exports){
"use strict";

// import observe from "tnt-observe";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _diffpatch = require("./diffpatch");

var _diffpatch2 = _interopRequireDefault(_diffpatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Component extends HTMLElement {

  constructor() {
    super();
    this.enabled = true;
    this._currentVirtualNode = null;
    if (this.inShadow) {
      this.root = this.attachShadow({ mode: 'open' });
    } else {
      this.root = this;
    }
  }

  enable() {
    this.enabled = true;
    this.refresh();
    this.enableCallback();
  }

  get passesModelToChildren() {
    return true;
  }

  get inShadow() {
    return true;
  }

  connectedCallback() {
    this.refresh();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this.refresh();
  }

  refresh() {
    if (this.enabled) {
      _diffpatch2.default.setCurrentComponent(this);
      let newVirtualNode = this.render();
      _diffpatch2.default.updateElement(this.root, newVirtualNode, this._currentVirtualNode);
      this._currentVirtualNode = newVirtualNode;
    }
  }

  render() {}
  enableCallback() {}
}
exports.default = Component;

},{"./diffpatch":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XButton extends _morello.Component {

  execute() {
    alert('mooi');
  }

  render() {
    return (0, _morello.morello)(
      "button",
      { onClick: this.execute },
      (0, _morello.morello)("slot", null)
    );
  }
}

exports.default = XButton;

},{"../morello":9}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XRoot extends _morello.Component {

  render() {
    return (0, _morello.morello)("slot", null);
  }

  connectedCallback() {

    this.enable();

    const children = Array.from(this.children);

    children.forEach(c => {
      if (typeof c.enable === 'function') {
        c.enable();
      }
    });
  }
}

exports.default = XRoot;

},{"../morello":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

class XRoute extends _morello.Component {

  static get observedAttributes() {
    return ['open'];
  }

  render() {
    if (this.getAttribute('open')) {
      return (0, _morello.morello)('slot', null);
    }
    return (0, _morello.morello)('div', null);
  }
}

exports.default = XRoute;

},{"../morello":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XWindow extends _morello.Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          color: #ffffff;
          background-color: #000000;
        }
        .window {
          border: 1px solid #000000;
        }
        .content {
          padding: 10px;
        }
      </style>
    `;
  }

  render() {

    return (0, _morello.morello)(
      "div",
      { "class": "window" },
      (0, _morello.morello)(
        "div",
        { "class": "header" },
        this.getAttribute('title') || 'Window',
        (0, _morello.morello)(
          "div",
          { "class": "header-slots" },
          (0, _morello.morello)("slot", { name: "header" })
        )
      ),
      (0, _morello.morello)(
        "div",
        { "class": "content" },
        (0, _morello.morello)("slot", null)
      )
    );
  }
}

exports.default = XWindow;

},{"../morello":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vdoc = require("./vdoc");

var _vdoc2 = _interopRequireDefault(_vdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const diffpatch = {
  currentComponent: null,
  setCurrentComponent: function ($component) {
    if ($component) {
      diffpatch.currentComponent = $component;
    }
  },
  updateElement: function ($parent, newNode, oldNode, index = 0) {

    if (!oldNode) {

      $parent.appendChild(_vdoc2.default.createElement(newNode, diffpatch.currentComponent));
    } else if (!newNode) {

      $parent.removeChild($parent.childNodes[index]);
    } else if (diffpatch.isDiff(newNode, oldNode)) {

      $parent.replaceChild(_vdoc2.default.createElement(newNode, diffpatch.currentComponent), $parent.childNodes[index]);
    } else if (newNode.tag && $parent) {

      diffpatch.updateAttributes($parent.childNodes[index], newNode.attrs, oldNode.attrs);

      const newLength = newNode.children.length,
            oldLength = oldNode.children.length;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        diffpatch.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
  },
  updateAttribute: function ($target, name, newVal, oldVal) {
    if (!newVal) {
      _vdoc2.default.removeAttribute($target, name, newVal);
    } else if (!oldVal || newVal !== oldVal) {
      _vdoc2.default.setAttribute($target, name, newVal);
    }
  },
  updateAttributes: function ($target, newAttrs, oldAttrs = {}) {
    const props = Object.assign({}, newAttrs, oldAttrs);
    Object.keys(props).forEach(name => {
      diffpatch.updateAttribute($target, name, newAttrs[name], oldAttrs[name]);
    });
  },
  isDiff: function (node1, node2) {
    return typeof node1 !== typeof node2 || (typeof node1 === 'string' || typeof node1 === 'number') && node1 !== node2 || node1.tag !== node2.tag;
  }
};

exports.default = diffpatch;

},{"./vdoc":11}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;
function h(tag, attrs, ...children) {
  children = [].concat.apply([], children);
  return { tag, attrs, children };
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.morello = undefined;

var _h = require("./h");

var _h2 = _interopRequireDefault(_h);

var _component = require("./component");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.morello = _h2.default;
exports.Component = _component2.default;

},{"./component":2,"./h":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const util = {
  isEventAttribute(name) {
    return (/^on/.test(name)
    );
  },
  getEventNameFromAttribute(name) {
    return name.slice(2).toLowerCase();
  }
};

exports.default = util;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const vdocument = {
  createElement: function (node, $currentComponent = null) {

    if (typeof node === 'string' || typeof node === 'number') {
      return document.createTextNode(node);
    }

    const $el = document.createElement(node.tag);
    const attrs = node.attrs || {};

    Object.keys(attrs).forEach(name => {

      if (_util2.default.isEventAttribute(name)) {

        const e = attrs[name].bind($currentComponent);
        vdocument.bindEvent($el, _util2.default.getEventNameFromAttribute(name), e);
      } else {

        vdocument.setAttribute($el, name, attrs[name]);
      }
    });

    node.children.forEach(c => {
      $el.appendChild(vdocument.createElement(c, $currentComponent));
    });

    return $el;
  },
  setAttribute: function ($target, name, value) {

    // is custom attribute
    if (vdocument.isCustomAttribute(name)) {
      return;
    }

    // is boolean attribute
    if (typeof value === 'boolean') {
      if (!value) {
        return;
      } else {
        $target[name] = true;
      }
    }

    // is class attribute
    if (name === 'className') {
      name = 'class';
    }

    $target.setAttribute(name, value);
  },
  removeAttribute: function ($target, name, newVal) {

    if (typeof newVal === 'boolean') {
      $target[name] = false;
    }

    if (name === 'className') {
      name = 'class';
    }

    $target.removeAttribute(name);
  },
  isCustomAttribute: function (name) {
    return _util2.default.isEventAttribute(name);
  },
  bindEvent($target, eventName, func) {
    $target.addEventListener(eventName, func);
  }
};

exports.default = vdocument;

},{"./util":10}]},{},[1]);
