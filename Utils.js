module.exports = class Utils {

	static formatDuration(milliseconds) {
		const m = Math.floor(milliseconds / 60000);
    const s = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor(milliseconds % 1000);

		return `${m > 9 ? m : '0' + m }:${s > 9 ? s : '0' + s}:${ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms}`;
	}

	static getDistance(A, B) {
		return Math.sqrt( Math.pow( B.x - A.x, 2 ) + Math.pow( B.y - A.y, 2 ) );
	}

}
