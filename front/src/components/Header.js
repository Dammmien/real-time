import { Component } from 'inferno';
import { connect } from 'inferno-redux';

class Header extends Component {

  constructor() {
    super();
  }

  render() {
    return ( <header><div id="timer">{this.props.timer}</div></header> );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    timer: state.timer
  }
}
 
export default connect(
  mapStateToProps
)(Header)
