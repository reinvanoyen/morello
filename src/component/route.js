import { morello, Component } from "../morello";
import Router from '../router/router';

class XRoute extends Component {

  static get observedAttributes() {
    return [ 'open' ];
  }

  get autoEnableChildren() {
    return false;
  }

  enableCallback() {
    // Register the route in the router
    if (this.getAttribute('name')) {
      let path = ( Router.path ? Router.path + '/' : '' ) + this.getAttribute('name');
      Router.add(path, (model) => {
        this.setModel(model);
        this.execute();
      }, () => {
        this.destroy()
      });
    }
  }

  execute() {
    this.setAttribute('open', true);
    this.enableChildren();
  }

  destroy() {
    this.removeAttribute('open');
  }

  render() {
    if (this.getAttribute('open')) {
      return <slot></slot>;
    }
    return <div></div>;
  }
}

export default XRoute;