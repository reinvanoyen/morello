"use strict";

import vdoc from "./vdoc";

const diffpatch = {
  currentComponent: null,
  setCurrentComponent: function($component) {
    if ($component) {
      diffpatch.currentComponent = $component;
    }
  },
  updateElement: function($parent, newNode, oldNode, index = 0) {

    if (!oldNode) {

      $parent.appendChild(vdoc.createElement(newNode, diffpatch.currentComponent));

    } else if (!newNode) {

      $parent.removeChild($parent.childNodes[index]);

    } else if (diffpatch.isDiff(newNode, oldNode)) {

      $parent.replaceChild(vdoc.createElement(newNode, diffpatch.currentComponent), $parent.childNodes[index]);

    } else if (newNode.tag && $parent) {

      diffpatch.updateAttributes($parent.childNodes[index], newNode.attrs, oldNode.attrs);

      const newLength = newNode.children.length,
          oldLength = oldNode.children.length
      ;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        diffpatch.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i );
      }
    }
  },
  updateAttribute: function($target, name, newVal, oldVal) {
    if (!newVal) {
      vdoc.removeAttribute($target, name, newVal);
    } else if (!oldVal || newVal !== oldVal) {
      vdoc.setAttribute($target, name, newVal);
    }
  },
  updateAttributes: function($target, newAttrs, oldAttrs = {}) {
    const props = Object.assign({}, newAttrs, oldAttrs);
    Object.keys(props).forEach(name => {
      diffpatch.updateAttribute($target, name, newAttrs[name], oldAttrs[name]);
    });
  },
  isDiff: function(node1, node2) {
    return (
        typeof node1 !== typeof node2 ||
        ( typeof node1 === 'string' || typeof node1 === 'number' ) && node1 !== node2 ||
        node1.tag !== node2.tag
    );
  }
};

export default diffpatch;