import { morello, Component } from "../morello";

class XRow extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .row {
          display: flex;
          justify-content: space-between;
        }
      </style>
    `;
  }

  render() {
    return (
        <div class="row">
          <slot></slot>
        </div>
    );
  }
}

export default XRow;