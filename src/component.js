"use strict";

// import observe from "tnt-observe";
import diffpatch from "./diffpatch";

export default class Component extends HTMLElement {

  constructor() {
    super();
    this.model = {};
    this._currentVirtualNode = null;
    if (this.inShadow) {
      this.root = this.attachShadow({mode: 'open'});
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
    diffpatch.setCurrentComponent(this);
    let newVirtualNode = this.render();
    diffpatch.updateElement(this.root, newVirtualNode, this._currentVirtualNode);
    this._currentVirtualNode = newVirtualNode;
    this.renderCallback();
  }

  render() {}
  renderCallback() {}
}