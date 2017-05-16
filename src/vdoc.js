"use strict";

import util from "./util";

const vdocument = {
  createElement: function(node, $currentComponent = null) {

    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const $el = document.createElement(node.tag);
    const attrs = node.attrs || {};

    Object.keys(attrs).forEach(name => {

      if (util.isEventAttribute(name)) {

        const e = attrs[name].bind($currentComponent);
        vdocument.bindEvent($el, util.getEventNameFromAttribute(name), e);

      } else {

        vdocument.setAttribute($el, name, attrs[name]);
      }
    });

    node.children.forEach( c => {
      $el.appendChild(vdocument.createElement(c, $currentComponent));
    } );

    return $el;
  },
  setAttribute: function($target, name, value) {

    if (vdocument.isCustomAttribute(name)) {
      return;
    }

    if (name === 'className') {
      name = 'class';
    }

    $target.setAttribute(name, value);
  },
  removeAttribute: function($target, name) {
    if (name === 'className') {
      name = 'class';
    }

    $target.removeAttribute(name);
  },
  isCustomAttribute: function(name) {
    return util.isEventAttribute(name);
  },
  bindEvent($target, eventName, func) {
    $target.addEventListener(eventName, func);
  }
};

export default vdocument;