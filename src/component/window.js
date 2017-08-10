import { morello, Component } from "../morello";

class XWindow extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          color: #ffffff;
          background-color: #000000;
        }
        .window {
          border: 1px solid #000000;
        }
        .content {
          padding: 10px;
        }
      </style>
    `;
  }

  render() {

    return (
        <div class="window">
          <div class="header">
            {this.getAttribute('title') || 'Window'}
            <div class="header-slots"><slot name="header"></slot></div>
          </div>
          <div class="content"><slot></slot></div>
        </div>
    );
  }
}

export default XWindow;