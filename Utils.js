module.exports = class Utils {

	static formatDuration(milliseconds) {
		const m = Math.floor(milliseconds / 60000);
    const s = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor(milliseconds % 1000);

		return `${m > 10 ? m : '0' + m }:${s > 10 ? s : '0' + s}:${ms > 99 ? ms : ms > 10 ? '0' + ms : '00' + ms}`;
	}

}
