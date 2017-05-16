"use strict";

export default function h(tag, attrs, ...children) {
  children = [].concat.apply([], children);
  return { tag, attrs, children };
}