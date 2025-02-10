'use strict';

const fs = require('fs');
const csv = require('fast-csv');

module.exports = class {
	constructor(config) {
		this.config = config;
		if (!this.config.enabled) {
			return;
		}

		this._writableStream = fs.createWriteStream(this.config.path);
		this._csvStream = csv.createWriteStream({headers: true});
		this._csvStream.pipe(this._writableStream);
	}

	stop() {
		if (!this.config.enabled) {
			return;
		}

		this._csvStream.end();
		this._writableStream.end();
	}

	now() {
		var now = new Date();
		return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	}

	write(data) {
		if (!this.config.enabled) {
			return;
		}

		this._csvStream.write(data);
	}
};