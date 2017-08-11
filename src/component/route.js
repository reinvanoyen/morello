import { morello, Component } from "../morello";
import Router from "../router/router";

class XRoute extends Component {

  static get observedAttributes() {
    return [ 'open' ];
  }

  renderCallback() {
    Router.add(this.getAttribute('name'), (model) => {
      this.setModel(model);
      this.setAttribute('open', true);
    });
  }

  render() {
    console.log(this.getAttribute('open'));
    if (this.getAttribute('open')) {
      return <slot></slot>;
    }
    return <div></div>;
  }
}

export default XRoute;