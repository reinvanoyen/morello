"use strict";

// import observe from "tnt-observe";
import diffpatch from "./diffpatch";

export default class Component extends HTMLElement {

  constructor() {
    super();
    this.model = {};
    this.enabled = false;
    this._currentVirtualNode = null;
    this.root = ( this.inShadow ? this.attachShadow({mode: 'open'}) : this );
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
      diffpatch.setCurrentComponent(this);
      let newVirtualNode = this.render();
      diffpatch.updateElement(this.root, newVirtualNode, this._currentVirtualNode);
      this._currentVirtualNode = newVirtualNode;
    }
  }

  render() {}
  enableCallback() {}
  setModelCallback() {}
}