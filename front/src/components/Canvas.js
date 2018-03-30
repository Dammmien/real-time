import { Component } from 'inferno';
import { connect } from 'inferno-redux';

class Canvas extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.canvas = document.querySelector('canvas');
    this.canvas.height = 1400;
    this.canvas.style.height = 1400;
    this.canvas.width = 2000;
    this.canvas.style.width = 2000;
    this.ctx = this.canvas.getContext('2d');
    this.update();
  }

  clear() {
    this.ctx.clearRect(0, 0, 2000, 1400);
  }

  update() {
    this.clear();
    this.props.missiles.forEach(missile => missile.render(this.ctx));
    this.props.users.forEach(user => {
      user.render(this.ctx);
      if (user.isMe) this.followUser(user);
    });
    this.props.bonus.forEach(bonus => bonus.render(this.ctx));
    requestAnimationFrame(this.update.bind(this));
  }

  followUser(user) {
    this.canvas.style.left = `${-this.props.user.x + window.innerWidth / 2}px`;
    this.canvas.style.top = `${-this.props.user.y + window.innerHeight / 2}px`;
  }

  render() {
    return (
      <canvas></canvas>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.users.find(user => user.isMe) || {},
    users: state.users,
    missiles: state.missiles,
    bonus: state.bonus
  }
}
 
export default connect(
  mapStateToProps
)(Canvas)
