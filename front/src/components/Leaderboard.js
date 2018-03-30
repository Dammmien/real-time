import { Component } from 'inferno';
import { connect } from 'inferno-redux';

class Leaderboard extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <ul id="leaderboard">
        {this.props.users.map(user => <li className={user.isMe ? 'me' : ''}>{user.displayName}: {user.score}</li>)}
      </ul>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users.sort((a, b) => b.score - a.score)
  }
}
 
export default connect(
  mapStateToProps
)(Leaderboard)
