import { morello, Component } from "../morello";

class XFetch extends Component {

  get autoEnableChildren() {
    return false;
  }

  async fetch() {

    let filename = this.getAttribute('file');

    if (filename) {

      let response = await fetch(filename);
      let object = await response.json();

      this.setModel(object);
      this.enableChildren();
    }
  }

  enableCallback() {
    this.fetch();
  }

  render() {
    return <slot></slot>;
  }
}

export default XFetch;