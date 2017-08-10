(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _button = require("./src/component/button");

var _button2 = _interopRequireDefault(_button);

var _fetch = require("./src/component/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

var _repeat = require("./src/component/repeat");

var _repeat2 = _interopRequireDefault(_repeat);

var _route = require("./src/component/route");

var _route2 = _interopRequireDefault(_route);

var _row = require("./src/component/row");

var _row2 = _interopRequireDefault(_row);

var _save = require("./src/component/save");

var _save2 = _interopRequireDefault(_save);

var _stringview = require("./src/component/stringview");

var _stringview2 = _interopRequireDefault(_stringview);

var _window = require("./src/component/window");

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('x-button', _button2.default);
customElements.define('x-fetch', _fetch2.default);
customElements.define('x-repeat', _repeat2.default);
customElements.define('x-route', _route2.default);
customElements.define('x-row', _row2.default);
customElements.define('x-save', _save2.default);
customElements.define('x-string-view', _stringview2.default);
customElements.define('x-window', _window2.default);

},{"./src/component/button":3,"./src/component/fetch":4,"./src/component/repeat":5,"./src/component/route":6,"./src/component/row":7,"./src/component/save":8,"./src/component/stringview":9,"./src/component/window":10}],2:[function(require,module,exports){
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
    this.model = {};
    this._currentVirtualNode = null;
    if (this.inShadow) {
      this.root = this.attachShadow({ mode: 'open' });
    } else {
      this.root = this;
    }
  }

  get passesModelToChildren() {
    return true;
  }

  get inShadow() {
    return true;
  }

  setModel(model) {

    this.model = model;

    if (this.passesModelToChildren) {
      const children = Array.from(this.children);

      children.forEach(c => {
        if (typeof c.setModel === 'function') {
          c.setModel(this.model);
        }
      });
    }

    this.refresh();
  }

  connectedCallback() {
    this.refresh();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this.refresh();
  }

  refresh() {
    _diffpatch2.default.setCurrentComponent(this);
    let newVirtualNode = this.render();
    _diffpatch2.default.updateElement(this.root, newVirtualNode, this._currentVirtualNode);
    this._currentVirtualNode = newVirtualNode;
    this.renderCallback();
  }

  render() {}
  renderCallback() {}
}
exports.default = Component;

},{"./diffpatch":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

var _router = require("../router/router");

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XButton extends _morello.Component {

  execute() {
    let route = this.getAttribute('route');
    if (route) {
      window.history.pushState(true, null, route);
      _router2.default.route();
    }
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

},{"../morello":13,"../router/router":14}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XFetch extends _morello.Component {

  fetch() {

    let filename = this.getAttribute('file');

    if (filename) {

      fetch(filename).then(response => response.json()).then(obj => this.setModel(obj));
    }
  }

  connectedCallback() {
    this.fetch();
  }

  render() {
    return (0, _morello.morello)("slot", null);
  }
}

exports.default = XFetch;

},{"../morello":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

class XRepeat extends _morello.Component {

  constructor() {
    super();
    this.originalElements = [];
    this.clonedElements = [];
  }

  renderCallback() {

    this.clonedElements.forEach(c => {
      this.removeChild(c);
    });
    this.clonedElements = [];

    const length = this.model.length - 1;
    const model = this.model;
    const children = Array.from(this.children);

    children.forEach(c => {
      if (typeof c.setModel === 'function') {
        c.setModel(model[0]);
      }
    });

    for (let i = 0; i < length; i++) {
      children.forEach(c => {
        const clone = c.cloneNode(true);
        this.clonedElements.push(clone);
        this.appendChild(clone);
        if (typeof clone.setModel === 'function') {
          clone.setModel(model[i + 1]);
        }
      });
    }
  }

  render() {
    return (0, _morello.morello)('slot', null);
  }
}

exports.default = XRepeat;

},{"../morello":13}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

var _router = require("../router/router");

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XRoute extends _morello.Component {

  static get observedAttributes() {
    return ['open'];
  }

  renderCallback() {
    _router2.default.add(this.getAttribute('name'), () => {
      this.setAttribute('open', true);
    });
  }

  render() {
    if (this.getAttribute('open')) {
      return (0, _morello.morello)("slot", null);
    }
    return (0, _morello.morello)(
      "div",
      null,
      "no"
    );
  }
}

exports.default = XRoute;

},{"../morello":13,"../router/router":14}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XRow extends _morello.Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .row {
          display: flex;
          justify-content: space-between;
        }
      </style>
    `;
  }

  render() {
    return (0, _morello.morello)(
      "div",
      { "class": "row" },
      (0, _morello.morello)("slot", null)
    );
  }
}

exports.default = XRow;

},{"../morello":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

class XSave extends _morello.Component {

  static get observedAttributes() {
    return ['text'];
  }

  save() {
    console.log(this.model);
  }

  render() {
    return (0, _morello.morello)(
      'button',
      { onClick: this.save },
      this.getAttribute('text') || 'Save'
    );
  }
}

exports.default = XSave;

},{"../morello":13}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

class XStringView extends _morello.Component {

  static get observedAttributes() {
    return ['field', 'editmode'];
  }

  get passesModelToChildren() {
    return false;
  }

  edit() {
    this.setAttribute('editmode', true);
  }

  updateValue() {

    const field = this.getAttribute('field');
    this.model[field] = this.root.querySelector('input').value;
    this.removeAttribute('editmode');
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');
    const editmode = this.getAttribute('editmode');

    if (!field) {
      return;
    }

    const value = model[field] ? model[field] : '-';

    if (editmode) {
      return (0, _morello.morello)('input', { value: value, onBlur: this.updateValue });
    }

    return (0, _morello.morello)(
      'span',
      { onClick: this.edit },
      value
    );
  }
}

exports.default = XStringView;

},{"../morello":13}],10:[function(require,module,exports){
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

},{"../morello":13}],11:[function(require,module,exports){
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

},{"./vdoc":16}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;
function h(tag, attrs, ...children) {
  children = [].concat.apply([], children);
  return { tag, attrs, children };
}

},{}],13:[function(require,module,exports){
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

},{"./component":2,"./h":12}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const Router = {
  add: (name, cb) => {
    if (!Router.routes) {
      Router.routes = {};
    }
    Router.routes[name] = cb;
  },
  route: () => {
    console.log(Router.routes);
  }
};

exports.default = Router;

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./util":15}]},{},[1]);
