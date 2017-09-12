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

var _fetch = require("./src/component/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

var _navbar = require("./src/component/navbar");

var _navbar2 = _interopRequireDefault(_navbar);

var _overlay = require("./src/component/overlay");

var _overlay2 = _interopRequireDefault(_overlay);

var _repeat = require("./src/component/repeat");

var _repeat2 = _interopRequireDefault(_repeat);

var _row = require("./src/component/row");

var _row2 = _interopRequireDefault(_row);

var _stringview = require("./src/component/stringview");

var _stringview2 = _interopRequireDefault(_stringview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('x-root', _root2.default);
customElements.define('x-button', _button2.default);
customElements.define('x-window', _window2.default);
customElements.define('x-route', _route2.default);
customElements.define('x-fetch', _fetch2.default);
customElements.define('x-navbar', _navbar2.default);
customElements.define('x-overlay', _overlay2.default);
customElements.define('x-repeat', _repeat2.default);
customElements.define('x-row', _row2.default);
customElements.define('x-string-view', _stringview2.default);

// Enable root element
document.querySelector('x-root').enable();

},{"./src/component/button":3,"./src/component/fetch":4,"./src/component/navbar":5,"./src/component/overlay":6,"./src/component/repeat":7,"./src/component/root":8,"./src/component/route":9,"./src/component/row":10,"./src/component/stringview":11,"./src/component/window":12}],2:[function(require,module,exports){
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
    this.enabled = false;
    this._currentVirtualNode = null;
    this.root = this.inShadow ? this.attachShadow({ mode: 'open' }) : this;
  }

  get inShadow() {
    return true;
  }

  get autoEnableChildren() {
    return true;
  }

  get autoPassModel() {
    return true;
  }

  setModel(model) {
    this.model = model;

    if (this.autoPassModel) {
      const children = Array.from(this.children);

      children.forEach(c => {
        if (typeof c.setModel === 'function') {
          c.setModel(this.model);
        }
      });
    }

    this.refresh();
    this.setModelCallback();
  }

  enable() {
    this.enabled = true;

    if (this.autoEnableChildren) {
      this.enableChildren();
    }

    this.refresh();
    this.enableCallback();
  }

  enableChildren() {
    const children = Array.from(this.children);

    children.forEach(c => {
      if (typeof c.enable === 'function') {
        c.enable();
      }
    });
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
  setModelCallback() {}
}
exports.default = Component;

},{"./diffpatch":13}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

var _router = require('../router/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XButton extends _morello.Component {

  constructor() {
    super();
    this.path = '';
    this.root.innerHTML = `
      <style>
        button {
          border: 0;
          color: #ffffff;
          background-color: #4B5883;
          border-radius: 17px;
          height: 34px;
          padding: 0 10px;
          cursor: pointer;
        
        }
        button:hover {
          background-color: #4B5883;
        }
        button:focus {
          outline: none;
        }
        :host-context(x-navbar) button {
          font-size: 15px;
          margin-right: 5px;
          border-radius: 0;
          background-color: transparent;
          color: #555;
        }
        :host-context(x-navbar) button:hover {
          background-color: transparent;
        }
      </style>
    `;
  }

  click() {
    _router2.default.route(this.path, this.model);
  }

  enableCallback() {
    if (this.getAttribute('route')) {
      this.path = (_router2.default.path ? _router2.default.path + '/' : '') + this.getAttribute('route');
    }
  }

  render() {
    return (0, _morello.morello)(
      'button',
      { onClick: this.click },
      (0, _morello.morello)('slot', null)
    );
  }
}

exports.default = XButton;

},{"../morello":15,"../router/router":16}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XFetch extends _morello.Component {

  get autoEnableChildren() {
    return false;
  }

  async fetch() {

    let filename = this.getAttribute('file');

    if (filename) {

      let response = await fetch(filename);
      let object = await response.json();

      this.setModel(object);
      this.enableChildren();
    }
  }

  enableCallback() {
    this.fetch();
  }

  render() {
    return (0, _morello.morello)("slot", null);
  }
}

exports.default = XFetch;

},{"../morello":15}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XNavbar extends _morello.Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .navbar {
          padding: 10px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      </style>
    `;
  }

  render() {

    return (0, _morello.morello)(
      "div",
      { "class": "navbar" },
      (0, _morello.morello)("slot", null)
    );
  }
}

exports.default = XNavbar;

},{"../morello":15}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XOverlay extends _morello.Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(50,50,50,0.75);
        }
      </style>
    `;
  }

  render() {

    return (0, _morello.morello)(
      "div",
      { "class": "overlay" },
      (0, _morello.morello)("slot", null)
    );
  }
}

exports.default = XOverlay;

},{"../morello":15}],7:[function(require,module,exports){
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

  get autoEnableChildren() {
    return false;
  }

  get autoPassModel() {
    return false;
  }

  setModelCallback() {

    this.clonedElements.forEach(c => {
      this.removeChild(c);
    });

    this.clonedElements = [];

    const model = this.model;
    const length = this.model.length - 1;
    const children = Array.from(this.children);

    // Set model of each child and enable
    children.forEach(c => {
      if (typeof c.setModel === 'function') {
        c.setModel(model[0]);
        c.enable();
      }
    });

    // Clone all children and cycle through the model
    for (let i = 0; i < length; i++) {
      children.forEach(c => {

        const clone = c.cloneNode(true);
        this.clonedElements.push(clone);
        this.appendChild(clone);
        if (typeof clone.setModel === 'function') {
          clone.setModel(model[i + 1]);
          clone.enable();
        }
      });
    }
  }

  render() {
    return (0, _morello.morello)('slot', null);
  }
}

exports.default = XRepeat;

},{"../morello":15}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require("../morello");

class XRoot extends _morello.Component {

  render() {
    return (0, _morello.morello)("slot", null);
  }
}

exports.default = XRoot;

},{"../morello":15}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

var _router = require('../router/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XRoute extends _morello.Component {

  static get observedAttributes() {
    return ['open'];
  }

  get autoEnableChildren() {
    return false;
  }

  enableCallback() {
    // Register the route in the router
    if (this.getAttribute('name')) {
      let path = (_router2.default.path ? _router2.default.path + '/' : '') + this.getAttribute('name');
      _router2.default.add(path, model => {
        this.setModel(model);
        this.execute();
      }, () => {
        this.destroy();
      });
    }
  }

  execute() {
    this.setAttribute('open', true);
    this.enableChildren();
  }

  destroy() {
    this.removeAttribute('open');
  }

  render() {
    if (this.getAttribute('open')) {
      return (0, _morello.morello)('slot', null);
    }
    return (0, _morello.morello)('div', null);
  }
}

exports.default = XRoute;

},{"../morello":15,"../router/router":16}],10:[function(require,module,exports){
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

},{"../morello":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morello = require('../morello');

class XStringView extends _morello.Component {

  static get observedAttributes() {
    return ['field'];
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');
    const editmode = this.getAttribute('editmode');

    if (!field) {
      return;
    }

    const value = model && model[field] ? model[field] : '-';

    return (0, _morello.morello)(
      'span',
      null,
      value
    );
  }
}

exports.default = XStringView;

},{"../morello":15}],12:[function(require,module,exports){
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
        .window {
          overflow: hidden;
          background-color: #ffffff;
        }
        .header {
          font-family: sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          padding: 20px 10px;
          color: #000000;
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

},{"../morello":15}],13:[function(require,module,exports){
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

},{"./vdoc":18}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;
function h(tag, attrs, ...children) {
  children = [].concat.apply([], children);
  return { tag, attrs, children };
}

},{}],15:[function(require,module,exports){
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

},{"./component":2,"./h":14}],16:[function(require,module,exports){
"use strict";

const Router = {
  path: '',
  routes: {},
  executedRoutes: [],
  add(path, execute, destroy) {
    Router.routes[path] = [execute, destroy];
  },
  route(route, model) {

    console.log('routing:', route);

    Router.path = route;

    let segments = Router.path.split('/');
    let routesToExecute = [];

    let current = '';
    segments.forEach((segment, i) => {
      current += (i !== 0 ? '/' : '') + segments[i];
      routesToExecute.push(current);
    });

    // @TODO make 2 arrays, one of routes to destroy and one of routes to execute
    let routesToDestroy = Router.executedRoutes.filter(route => {
      return routesToExecute.indexOf(route.path) === -1;
    });

    let routesToNotExecuteAgain = Router.executedRoutes.map(route => {
      // @TODO reverse the list -> only routes that need to be executed
      if (routesToExecute.indexOf(route.path) > -1) {
        return route.path;
      }
    });

    // Destroy routes
    routesToDestroy.forEach(route => {
      console.log('-- destroying:', route.path);
      route.destroy();
    });

    Router.executedRoutes = [];

    // Execute routes
    routesToExecute.forEach(path => {

      if (Router.routes[path]) {

        if (routesToNotExecuteAgain.indexOf(path) === -1) {

          console.log('-- executing:', path);
          Router.routes[path][0](model);
        }

        Router.executedRoutes.push({
          path: path,
          modelId: model.id ? model.id : false,
          destroy: Router.routes[path][1]
        });
      } else {

        console.error('-- invalid', path);
      }
    });
  }
};

module.exports = Router;

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./util":17}]},{},[1]);
