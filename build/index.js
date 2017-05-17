(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _morello = require("./src/morello");

class XStringView extends _morello.Component {

  constructor() {
    super();
    this.model = {};
  }

  static get observedAttributes() {
    return ['field'];
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');

    return (0, _morello.morello)(
      "span",
      null,
      model[field] ? 'test' : 'lol'
    );
  }
}

class XTodoItem extends _morello.Component {

  constructor() {
    super();
    this.model = {
      editMode: false,
      isDone: false
    };
  }

  static get observedAttributes() {
    return ['text'];
  }

  enableEditMode() {
    this.model.editMode = true;
    this.refresh();
  }

  stateChange(e) {
    this.model.isDone = this._shadowRoot.querySelector('.state-change').checked;
    this.refresh();
  }

  updateText() {
    this.model.editMode = false;
    this.setAttribute('text', this._shadowRoot.querySelector('.edit-field').value);
  }

  render() {

    const model = this.model;
    const text = this.getAttribute('text');

    return (0, _morello.morello)(
      "span",
      null,
      (0, _morello.morello)("input", { type: "checkbox", checked: model.isDone, onClick: this.stateChange, "class": "state-change" }),
      model.editMode ? (0, _morello.morello)("input", { "class": "edit-field", value: text, onBlur: this.updateText }) : (0, _morello.morello)(
        "span",
        { onDblClick: this.enableEditMode, style: 'color: ' + (model.isDone ? 'green' : 'black') + ';' },
        text + (model.isDone ? ' (done)' : '')
      )
    );
  }
}

class XTodo extends _morello.Component {

  constructor() {
    super();
    this.model = {
      items: ['nice']
    };
  }

  addItem(text) {

    this.model.items.push(text);
    this.refresh();
  }

  removeItem(index) {
    if (window.confirm('Are you sure you wish to remove "' + this.model.items[index] + '" ?')) {
      this.model.items.splice(index, 1);
      this.refresh();
    }
  }

  render() {

    const items = this.model.items;

    return (0, _morello.morello)(
      "div",
      null,
      (0, _morello.morello)(
        "x-window",
        { title: 'Todo demo (' + items.length + ')' },
        items.length ? (0, _morello.morello)(
          "div",
          null,
          items.map((item, i) => {
            return (0, _morello.morello)(
              "div",
              { key: i },
              (0, _morello.morello)("x-todo-item", { text: item }),
              (0, _morello.morello)(
                "button",
                { onClick: () => this.removeItem(i) },
                "x"
              )
            );
          })
        ) : (0, _morello.morello)(
          "div",
          null,
          "Your todo list is empty."
        ),
        (0, _morello.morello)(
          "form",
          { onSubmit: e => {
              this.addItem(this._shadowRoot.querySelector('.field').value);e.preventDefault();
            } },
          (0, _morello.morello)("input", { "class": "field" }),
          (0, _morello.morello)(
            "button",
            null,
            "Add"
          )
        )
      )
    );
  }
}

class XWindow extends _morello.Component {

  static get observedAttributes() {
    return ['title', 'footer'];
  }

  rename() {
    this.setAttribute('title', this._shadowRoot.querySelector('.field').value);
  }

  enableEditMode() {
    this.model.editMode = true;
    this.refresh();
  }

  disableEditMode() {
    this.model.editMode = false;
    this.refresh();
  }

  render() {

    return (0, _morello.morello)(
      "div",
      null,
      (0, _morello.morello)(
        "div",
        null,
        this.model.editMode ? (0, _morello.morello)("input", { onKeyUp: this.rename, onBlur: this.disableEditMode, value: this.getAttribute('title'), "class": "field" }) : (0, _morello.morello)(
          "span",
          { onDblClick: this.enableEditMode },
          this.getAttribute('title') || 'Default title'
        )
      ),
      (0, _morello.morello)("slot", null)
    );
  }
}

customElements.define('x-todo', XTodo);
customElements.define('x-todo-item', XTodoItem);
customElements.define('x-string-view', XStringView);
customElements.define('x-window', XWindow);

},{"./src/morello":5}],2:[function(require,module,exports){
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
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
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
    _diffpatch2.default.updateElement(this._shadowRoot, newVirtualNode, this._currentVirtualNode);
    this._currentVirtualNode = newVirtualNode;
  }

  render() {}
}
exports.default = Component;

},{"./diffpatch":3}],3:[function(require,module,exports){
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
    } else if (newNode.tag) {

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
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.tag !== node2.tag;
  }
};

exports.default = diffpatch;

},{"./vdoc":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;
function h(tag, attrs, ...children) {
  children = [].concat.apply([], children);
  return { tag, attrs, children };
}

},{}],5:[function(require,module,exports){
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

},{"./component":2,"./h":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const vdocument = {
  createElement: function (node, $currentComponent = null) {

    if (typeof node === 'string') {
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

},{"./util":6}]},{},[1]);
