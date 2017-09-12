"use strict";

import { morello, Component } from "../morello";

class XOverlay extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(50,50,50,0.75);
        }
      </style>
    `;
  }

  render() {

    return (
        <div class="overlay">
          <slot></slot>
        </div>
    );
  }
}

export default XOverlay;