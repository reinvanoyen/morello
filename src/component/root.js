import { morello, Component } from "../morello";

class XRoot extends Component {

  render() {
    return <slot></slot>;
  }

  connectedCallback() {

    this.enable();

    const children = Array.from(this.children);

    children.forEach(c => {
      if (typeof c.enable === 'function') {
        c.enable();
      }
    } );
  }
}

export default XRoot;