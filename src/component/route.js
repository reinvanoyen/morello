import { morello, Component } from "../morello";
import Router from "../router/router";

class XRoute extends Component {

  static get observedAttributes() {
    return [ 'open' ];
  }

  renderCallback() {
    Router.add(this.getAttribute('name'), () => {
      this.setAttribute('open', true);
    });
  }

  render() {
    if (this.getAttribute('open')) {
      return <slot></slot>;
    }
    return <div>no</div>;
  }
}

export default XRoute;