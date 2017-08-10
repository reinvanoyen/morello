import { morello, Component } from "../morello";

class XSave extends Component {

  static get observedAttributes() {
    return [ 'text' ];
  }

  save() {
    console.log(this.model);
  }

  render() {
    return <button onClick={this.save}>{this.getAttribute('text') || 'Save'}</button>;
  }
}

export default XSave;