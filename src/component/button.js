import { morello, Component } from "../morello";
import Router from "../router/router";

class XButton extends Component {

  execute() {
    let route = this.getAttribute('route');
    if (route) {
      window.history.pushState(true, null, route);
      Router.route(this.model);
    }
  }

  render() {
    return <button onClick={this.execute}><slot></slot></button>;
  }
}

export default XButton;