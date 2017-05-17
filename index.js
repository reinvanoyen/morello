"use strict";

import { morello, Component } from "./src/morello";

class XStringView extends Component {

  constructor() {
    super();
    this.model = {};
  }

  static get observedAttributes() {
    return [ 'field' ];
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');

    return (
        <span>{model[field] ? 'test' : 'lol' }</span>
    );
  }
}

class XTodoItem extends Component {

  constructor() {
    super();
    this.model = {
      editMode: false,
      isDone: false
    };
  }

  static get observedAttributes() {
    return [ 'text' ];
  }

  enableEditMode() {
    this.model.editMode = true;
    this.refresh();
  }

  stateChange(e) {
    this.model.isDone = this._shadowRoot.querySelector( '.state-change' ).checked;
    this.refresh();
  }

  updateText() {
    this.model.editMode = false;
    this.setAttribute('text', this._shadowRoot.querySelector('.edit-field').value);
  }

  render() {

    const model = this.model;
    const text = this.getAttribute('text');

    return (
      <span>
        <input type="checkbox" checked={model.isDone} onClick={this.stateChange} class="state-change" />
        { model.editMode
          ?
          <input class="edit-field" value={text} onBlur={this.updateText} />
          :
          (
            <span onDblClick={this.enableEditMode} style={ 'color: ' + ( model.isDone ? 'green' : 'black' ) + ';' }>
                {text + ( model.isDone ? ' (done)' : '' )}
            </span>
          )
        }
      </span>
    );
  }
}

class XTodo extends Component {

  constructor() {
    super();
    this.model = {
      items: [
        'nice'
      ]
    };
  }

  addItem( text ) {

    this.model.items.push( text );
    this.refresh();
  }

  removeItem( index ) {
    if( window.confirm('Are you sure you wish to remove "' + this.model.items[ index ] + '" ?') ) {
      this.model.items.splice(index, 1);
      this.refresh();
    }
  }

  render() {

    const items = this.model.items;

    return (
        <div>
          <x-window title={'Todo demo (' + items.length + ')'}>
            { items.length
              ?
                <div>
                  {items.map( ( item, i ) => {
                    return (
                      <div key={i}>
                        <x-todo-item text={item}></x-todo-item>
                        <button onClick={()=>this.removeItem(i)}>x</button>
                      </div>
                    );
                  } )}
                </div>
              :
                <div>Your todo list is empty.</div>
            }
            <form onSubmit={(e)=>{ this.addItem(this._shadowRoot.querySelector('.field').value); e.preventDefault(); }}>
              <input class="field" />
              <button>Add</button>
            </form>
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

customElements.define('x-todo', XTodo);
customElements.define('x-todo-item', XTodoItem);
customElements.define('x-string-view', XStringView);
customElements.define('x-window', XWindow);