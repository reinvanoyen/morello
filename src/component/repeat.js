import { morello, Component } from "../morello";

class XRepeat extends Component {

  constructor() {
    super();
    this.originalElements = [];
    this.clonedElements = [];
  }

  renderCallback() {

    this.clonedElements.forEach(c => {
      this.removeChild(c);
    });
    this.clonedElements = [];

    const length = this.model.length - 1;
    const model = this.model;
    const children = Array.from(this.children);

    children.forEach(c => {
      if (typeof c.setModel === 'function') {
        c.setModel(model[0]);
      }
    } );

    for (let i = 0; i < length; i++) {
      children.forEach(c => {
        const clone = c.cloneNode(true);
        this.clonedElements.push(clone);
        this.appendChild(clone);
        if (typeof clone.setModel === 'function') {
          clone.setModel(model[i+1]);
        }
      });
    }
  }

  render() {
    return <slot></slot>;
  }
}

export default XRepeat;