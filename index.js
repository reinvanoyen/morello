"use strict";

function h(tag, attrs, ...children) {
  return { tag, attrs, children };
}

const vdocument = {
  createElement: function(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const $el = document.createElement(node.tag);

    Object.keys(node.attrs).forEach(name => {
      vdocument.setAttribute($el, name, node.attrs[name]);
    });

    node.children
      .map(vdocument.createElement)
      .forEach($el.appendChild.bind($el))
    ;

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

const component = (
  h('ul', { className: 'list' },
    h('li', {
      title: 'lol'
    }, 'wat'),
  )
);

const component2 = (
  h('ul', {},
    h('li', {
      title: 'ok'
    }, 'nice!!'),
    h('li', {}, 'test!!'),
    h('li', {}, 'nice!!'),
    h('li', {}, 'testtt!!'),
    h('window', {}, 'testtt!!'),
  )
);

console.log( component );

const $root = document.getElementById('root');
const $update = document.getElementById('update');

diff.updateElement($root, component);

$update.addEventListener('click', e => {
  diff.updateElement($root, component2, component);
});