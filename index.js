"use strict";

import { morello, Component } from "./src/morello";
import Observable from "./src/obs/observable";

let obj = [
  {name: 'rein'},
  {name: 'jos'}
];

let obs = new Observable( obj, res => {
  console.log(res);
} );

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

class XRow extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .row {
          display: flex;
          justify-content: space-between;
        }
      </style>
    `;
  }

  render() {
    return (
      <div class="row">
        <slot></slot>
      </div>
    );
  }
}

class XFetch extends Component {

  connectedCallback() {
    setTimeout(()=>{
      this.setModel([{
        id: 1,
        name: 'Rein',
        age: 27
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Roger',
        age: 25
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }, {
        id: 2,
        name: 'Jos',
        age: 56
      }]);
    }, 500);
  }

  render() {
    return <slot></slot>;
  }
}

class XStringView extends Component {

  static get observedAttributes() {
    return [ 'field', 'editmode' ];
  }

  get passesModelToChildren() {
    return false;
  }

  edit() {
    this.setAttribute('editmode', true);
  }

  updateValue() {

    const field = this.getAttribute('field');
    this.model[field] = this.root.querySelector('input').value;
    this.removeAttribute('editmode');
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');
    const editmode = this.getAttribute('editmode');

    if ( !field ) {
      return;
    }

    const value = ( model[field] ? model[field] : '-' );

    if (editmode) {
      return <input value={value} onBlur={this.updateValue} />;
    }

    return <span onClick={this.edit}>{value}</span>;
  }
}

class XWindow extends Component {

  constructor() {
    super();

    this.root.innerHTML = `
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          color: #ffffff;
          background-color: #000000;
        }
        .window {
          border: 1px solid #000000;
        }
        .content {
          padding: 10px;
        }
      </style>
    `;
  }

  render() {

    return (
      <div class="window">
        <div class="header">
          {this.getAttribute('title') || 'Window'}
          <div class="header-slots"><slot name="header"></slot></div>
        </div>
        <div class="content"><slot></slot></div>
      </div>
    );
  }
}

customElements.define('x-save', XSave);
customElements.define('x-repeat', XRepeat);
customElements.define('x-fetch', XFetch);
customElements.define('x-row', XRow);
customElements.define('x-string-view', XStringView);
customElements.define('x-window', XWindow);