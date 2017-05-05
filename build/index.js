(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _tntObserve = require("tnt-observe");

var _tntObserve2 = _interopRequireDefault(_tntObserve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Component
class Component extends HTMLElement {
  constructor() {
    super();
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
    let newVirtualNode = this.render();
    diff.updateElement(this._shadowRoot, newVirtualNode, this._currentVirtualNode);
    this._currentVirtualNode = newVirtualNode;
  }

  render() {}
}

// XWindow

class XWindow extends Component {

  static get observedAttributes() {
    return ['title', 'footer'];
  }

  render() {

    return h(
      "div",
      null,
      h(
        "div",
        null,
        this.getAttribute('title') || 'Default title',
        h(
          "button",
          null,
          "x"
        )
      ),
      h("slot", null),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h("x-button", { text: this.getAttribute('title') }),
      h(
        "div",
        null,
        this.getAttribute('footer') || 'Default footer text'
      )
    );
  }
}

class XButton extends Component {

  static get observedAttributes() {
    return ['text'];
  }

  render() {
    return h(
      "button",
      null,
      this.getAttribute('text') || 'Default button text'
    );
  }
}

customElements.define('x-window', XWindow);
customElements.define('x-button', XButton);

// VDOM

function h(tag, attrs, ...children) {
  return { tag, attrs, children };
}

const vdocument = {
  createElement: function (node) {

    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const $el = document.createElement(node.tag);
    const attrs = node.attrs || {};

    Object.keys(attrs).forEach(name => {
      vdocument.setAttribute($el, name, attrs[name]);
    });

    node.children.forEach(c => {
      $el.appendChild(vdocument.createElement(c));
    });

    return $el;
  },
  setAttribute: function ($target, name, value) {
    if (name === 'className') {
      name = 'class';
    }

    $target.setAttribute(name, value);
  },
  removeAttribute: function ($target, name, value) {
    if (name === 'className') {
      name = 'class';
    }

    $target.removeAttribute(name);
  }
};

const diff = {
  updateElement: function ($parent, newNode, oldNode, index = 0) {

    if (!oldNode) {

      $parent.appendChild(vdocument.createElement(newNode));
    } else if (!newNode) {

      $parent.removeChild($parent.childNodes[index]);
    } else if (diff.isDiff(newNode, oldNode)) {

      $parent.replaceChild(vdocument.createElement(newNode), $parent.childNodes[index]);
    } else if (newNode.tag) {

      diff.updateAttributes($parent.childNodes[index], newNode.attrs, oldNode.attrs);

      const newLength = newNode.children.length,
            oldLength = oldNode.children.length;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        diff.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
  },
  updateAttribute: function ($target, name, newVal, oldVal) {
    if (!newVal) {
      vdocument.removeAttribute($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      vdocument.setAttribute($target, name, newVal);
    }
  },
  updateAttributes: function ($target, newAttrs, oldAttrs = {}) {
    const props = Object.assign({}, newAttrs, oldAttrs);
    Object.keys(props).forEach(name => {
      diff.updateAttribute($target, name, newAttrs[name], oldAttrs[name]);
    });
  },
  isDiff: function (node1, node2) {

    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.tag !== node2.tag;
  }
};

},{"tnt-observe":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableObject = exports.ObservableArray = undefined;

var _array = require('./observe/array');

var _array2 = _interopRequireDefault(_array);

var _object = require('./observe/object');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ObservableArray = _array2.default;
exports.ObservableObject = _object2.default;
},{"./observe/array":3,"./observe/object":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var triggerChange = function triggerChange() {
	var _this = this;

	if (this._cb) {
		(function () {

			var result = [];
			_this.forEach(function (v) {
				return result.push(v);
			});
			_this._cb(result);
		})();
	}
};

var ObservableArray = function ObservableArray(array, cb) {

	Array.prototype.push.apply(this, array);
	this._cb = cb;
	return this;
};

ObservableArray.prototype = Object.create(Array.prototype);

['push', 'pop', 'shift', 'unshift', 'splice', 'splice', 'sort', 'reverse'].forEach(function (method) {

	ObservableArray.prototype[method] = function () {

		Array.prototype[method].apply(this, arguments);
		triggerChange.call(this);
	};
});

exports.default = ObservableArray;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _array = require("./array");

var _array2 = _interopRequireDefault(_array);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObservableObject = function ObservableObject(o, cb) {

	var copy = {};

	var processNewValue = function processNewValue(v, prop) {
		if (v.constructor === Array) {
			return observeArray(v, prop);
		}
		return v;
	};

	var observeArray = function observeArray(a, prop) {
		return new _array2.default(a, function (result) {
			copy[prop] = result;
			cb(copy);
		});
	};

	for (var prop in o) {
		copy[prop] = o[prop];
		o[prop] = processNewValue(o[prop], prop);
	}

	var handler = {
		set: function set(original, k, v) {
			original[k] = processNewValue(v, k);
			copy[k] = v;
			cb(copy);
			return true;
		},
		deleteProperty: function deleteProperty(original, k) {
			delete original[k];
			delete copy[k];
			cb(copy);
			return true;
		}
	};

	return new Proxy(o, handler);
};

exports.default = ObservableObject;
},{"./array":3}]},{},[1]);
