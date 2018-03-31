class Store {

	constructor(options) {
		this.subscriptions = {};
		this.data = options || {};
	}

	notify(key) {
		this.subscriptions[key].forEach(subscriber => subscriber.update(key, this.data[key]));
	}

	get(key) {
		return this.data[key];
	}

	set(key, value) {
		this.data[key] = value;
		this.notify(key);
	}

	subscribe(key, subscriber) {
		this.subscriptions[key] = this.subscriptions[key] || [];
		this.subscriptions[key].push(subscriber);
		return this.data[key];
	}

	unsubscribe(key, subscriber) {
		this.subscriptions[key] = this.subscriptions[key].filter(subscription => subscription !== subscriber);
	}

}
