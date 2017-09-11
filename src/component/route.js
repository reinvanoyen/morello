import { morello, Component } from "../morello";

class XRoute extends Component {

  static get observedAttributes() {
    return [ 'open' ];
  }

  render() {
    if (this.getAttribute('open')) {
      return <slot></slot>;
    }
    return <div></div>;
  }
}

export default XRoute;