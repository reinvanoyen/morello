import { morello, Component } from "../morello";

class XStringView extends Component {

  static get observedAttributes() {
    return [ 'field' ];
  }

  render() {

    const model = this.model;
    const field = this.getAttribute('field');
    const editmode = this.getAttribute('editmode');

    if ( !field ) {
      return;
    }

    const value = ( model && model[field] ? model[field] : '-' );

    return <span>{value}</span>;
  }
}

export default XStringView;