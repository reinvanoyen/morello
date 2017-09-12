import { morello, Component } from "../morello";
import Router from '../router/router';

class XButton extends Component {

  constructor() {
    super();
    this.path = '';
    this.root.innerHTML = `
      <style>
        button {
          border: 0;
          color: #ffffff;
          background-color: #4B5883;
          border-radius: 17px;
          height: 34px;
          padding: 0 10px;
          cursor: pointer;
        
        }
        button:hover {
          background-color: #4B5883;
        }
        button:focus {
          outline: none;
        }
        :host-context(x-navbar) button {
          font-size: 15px;
          margin-right: 5px;
          border-radius: 0;
          background-color: transparent;
          color: #555;
        }
        :host-context(x-navbar) button:hover {
          background-color: transparent;
        }
      </style>
    `;
  }

  click() {
    Router.route(this.path);
  }

  enableCallback() {
    if (this.getAttribute('route')) {
      this.path = ( Router.path ? Router.path + '/' : '' ) + this.getAttribute('route');
    }
  }

  render() {
    return <button onClick={this.click}><slot></slot></button>;
  }
}

export default XButton;