import { morello, Component } from "../morello";

class XFetch extends Component {

  async fetch() {

    let filename = this.getAttribute('file');

    if (filename) {

      let response = await fetch(filename);
      let object = await response.json();
      this.setModel(object);
    }
  }

  connectedCallback() {
    this.fetch();
  }

  render() {
    return <slot></slot>;
  }
}

export default XFetch;