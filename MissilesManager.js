const Missile = require('./Missile');

class MissilesManager {

  constructor(map) {
    if (typeof MissilesManager.instance === 'object') {
      return MissilesManager.instance;
    }

    this.missiles = [];
    this.map = map;

    MissilesManager.instance = this;

    return this;
  }

  update() {
  	this.missiles.forEach(missile => {
  		missile.update();
  		if (this.map.isOut(missile)) this.destroy(missile);
  	});
  }

	create(options) {
		this.missiles.push(new Missile(options));
	}

	reset() {
		this.missiles = [];
	}

	destroy(missile) {
		const index = this.missiles.indexOf(missile);
		this.missiles.splice(index, 1);
	}

}

module.exports = MissilesManager;
