"use strict";

const util = {
  isEventAttribute(name) {
    return /^on/.test(name);
  },
  getEventNameFromAttribute(name) {
    return name.slice(2).toLowerCase();
  }
};

export default util;