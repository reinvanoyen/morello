import { morello, Component } from "../morello";

class XFetch extends Component {

  fetch() {

    let filename = this.getAttribute('file');

    if (filename) {

      fetch(filename)
          .then(response => response.json())
          .then(obj => this.setModel(obj))
      ;
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