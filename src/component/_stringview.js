import { morello, Component } from "../morello";

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
    console.log(this.model);
    this.removeAttribute('editmode');
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');
    const editmode = this.getAttribute('editmode');

    if ( !field ) {
      return;
    }

    const value = ( model && model[field] ? model[field] : '-' );

    if (editmode) {
      return <input value={value} onBlur={this.updateValue} />;
    }

    return <span onClick={this.edit}>{value}</span>;
  }
}

export default XStringView;