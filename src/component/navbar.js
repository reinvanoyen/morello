import { morello, Component } from "../morello";

class XNavbar extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .navbar {
          padding: 10px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      </style>
    `;
  }

  render() {

    return (
        <div class="navbar">
          <slot></slot>
        </div>
    );
  }
}

export default XNavbar;