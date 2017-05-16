"use strict";

// import observe from "tnt-observe";
import diffpatch from "./diffpatch";

export default class Component extends HTMLElement {
  constructor() {
    super();
    this.model = {};
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
    diffpatch.setCurrentComponent(this);
    let newVirtualNode = this.render();
    diffpatch.updateElement(this._shadowRoot, newVirtualNode, this._currentVirtualNode);
    this._currentVirtualNode = newVirtualNode;
  }

  render() {}
}