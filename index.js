"use strict";

import observe from "tnt-observe";

// Component
class Component extends HTMLElement {
  constructor() {
    super();
    this._currentVirtualNode = null;
    this._shadowRoot = this.attachShadow({mode: 'closed'})
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

    return (
      <div>
        <div>{this.getAttribute('title') || 'Default title' }<button>x</button></div>
        <slot></slot>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <x-button text={this.getAttribute('title')}></x-button>
        <div>{this.getAttribute('footer') || 'Default footer text' }</div>
      </div>
    );
  }
}

class XButton extends Component {

  static get observedAttributes() {
    return ['text'];
  }

  render() {
    return (
      <button>{this.getAttribute('text') || 'Default button text'}</button>
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
  createElement: function(node) {

    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const $el = document.createElement(node.tag);
    const attrs = node.attrs || {};

    Object.keys(attrs).forEach(name => {
      vdocument.setAttribute($el, name, attrs[name]);
    });

    node.children.forEach( c => {
      $el.appendChild(vdocument.createElement(c));
    } );

    return $el;
  },
  setAttribute: function($target, name, value) {
    if (name === 'className') {
      name = 'class';
    }

    $target.setAttribute(name, value);
  },
  removeAttribute: function($target, name, value) {
    if (name === 'className') {
      name = 'class';
    }

    $target.removeAttribute(name);
  }
};

const diff = {
  updateElement: function($parent, newNode, oldNode, index = 0) {

    if (!oldNode) {

      $parent.appendChild(vdocument.createElement(newNode));

    } else if (!newNode) {

      $parent.removeChild($parent.childNodes[index]);

    } else if (diff.isDiff(newNode, oldNode)) {

      $parent.replaceChild(vdocument.createElement(newNode), $parent.childNodes[index]);

    } else if (newNode.tag) {

      diff.updateAttributes($parent.childNodes[index], newNode.attrs, oldNode.attrs);

      const newLength = newNode.children.length,
        oldLength = oldNode.children.length
      ;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        diff.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i );
      }
    }
  },
  updateAttribute: function($target, name, newVal, oldVal) {
    if (!newVal) {
      vdocument.removeAttribute($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      vdocument.setAttribute($target, name, newVal);
    }
  },
  updateAttributes: function($target, newAttrs, oldAttrs = {}) {
    const props = Object.assign({}, newAttrs, oldAttrs);
    Object.keys(props).forEach(name => {
      diff.updateAttribute($target, name, newAttrs[name], oldAttrs[name]);
    });
  },
  isDiff: function(node1, node2) {

    return (
      typeof node1 !== typeof node2 ||
      typeof node1 === 'string' && node1 !== node2 ||
      node1.tag !== node2.tag
    );
  }
};