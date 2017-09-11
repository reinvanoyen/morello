import { morello, Component } from "../morello";

class XButton extends Component {

  execute() {
    alert('mooi');
  }

  render() {
    return <button onClick={this.execute}><slot></slot></button>;
  }
}

export default XButton;