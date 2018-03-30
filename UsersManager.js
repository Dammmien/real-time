const User = require('./User');

class UsersManager {

  constructor(map) {
    if (typeof UsersManager.instance === 'object') {
      return UsersManager.instance;
    }

    this.users = [];
    this.map = map;

    UsersManager.instance = this;

    return this;
  }

	create(options) {
		const user = new User(options);
		this.users.push(user);
		return user;
	}

	destroy(user) {
		const index = this.users.indexOf(user);
		this.users.splice(index, 1);
	}

	reset(){
		this.users = this.users.map(user => {
			return new User({
				id: user.id,
				x: Math.random() * this.map.width,
				y: Math.random() * this.map.height,
				name: user.name,
				socket: user.socket,
				map: this.map
			});
		});
	}

}


module.exports = UsersManager;
