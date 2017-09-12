import { morello, Component } from "../morello";

class XWindow extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .window {
          overflow: hidden;
          background-color: #ffffff;
        }
        .header {
          font-family: sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          padding: 20px 10px;
          color: #000000;
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