"use strict";

import { morello, Component } from "./src/morello";

class XTodo extends Component {

  constructor() {
    super();
    this.model.text = 'ok';
    this.model.items = [
        'een item',
        'nog een item'
    ];
  }

  render() {

    return (
        <div>
          <x-window title="Todo demo">
            {this.model.items.map(function(listValue){
              return <div>{listValue}</div>;
            })}
            <button></button>
          </x-window>
        </div>
    );
  }
}

class XWindow extends Component {

  static get observedAttributes() {
    return ['title', 'footer'];
  }

  rename() {
    this.setAttribute('title', this._shadowRoot.querySelector('.field').value);
  }

  enableEditMode() {
    this.model.editMode = true;
    this.refresh();
  }

  disableEditMode() {
    this.model.editMode = false;
    this.refresh();
  }

  render() {

    return (
      <div>
        <div>
          { this.model.editMode ?
            <input onKeyUp={this.rename} onBlur={this.disableEditMode} value={this.getAttribute('title')} class="field" />
            :
            <span onDblClick={this.enableEditMode}>{this.getAttribute('title') || 'Default title' }</span>
          }
        </div>
        <slot></slot>
      </div>
    );
  }
}

class XButton extends Component {

  static get observedAttributes() {
    return ['text'];
  }

  render() {
    return (
      <button>{this.getAttribute('text') || 'Default button text'}</button>
    );
  }
}

customElements.define('x-todo', XTodo);
customElements.define('x-window', XWindow);
customElements.define('x-button', XButton);