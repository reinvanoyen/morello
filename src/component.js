"use strict";

// import observe from "tnt-observe";
import diffpatch from "./diffpatch";

export default class Component extends HTMLElement {

  constructor() {
    super();
    this.enabled = true;
    this._currentVirtualNode = null;
    if (this.inShadow) {
      this.root = this.attachShadow({mode: 'open'});
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
      diffpatch.setCurrentComponent(this);
      let newVirtualNode = this.render();
      diffpatch.updateElement(this.root, newVirtualNode, this._currentVirtualNode);
      this._currentVirtualNode = newVirtualNode;
    }
  }

  render() {}
  enableCallback() {}
}