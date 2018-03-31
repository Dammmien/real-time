const Bonus = require('./Bonus');

class BonusManager {

  constructor() {
    if (typeof BonusManager.instance === 'object') {
      return BonusManager.instance;
    }

    this.bonus = [];

    BonusManager.instance = this;

    return this;
  }

	create(options) {
		this.bonus.push(new Bonus(options));
	}

	reset() {
		this.bonus = [];
	}

	destroy(bonus) {
		const index = this.bonus.indexOf(bonus);
		this.bonus.splice(index, 1);
	}

}

module.exports = BonusManager;
