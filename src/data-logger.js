'use strict';

const fs = require('fs');
const csv = require('fast-csv');

module.exports = class {
	constructor(logPath) {
		this._csvStream = csv.createWriteStream({headers: true});
	    this._writableStream = fs.createWriteStream(logPath);

		this._csvStream.pipe(this._writableStream);
	}

	stop() {
		this._csvStream.end();
		this._writableStream.end();
	}

	now() {
		var now = new Date();
		return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	}

	write(data) {
		this._csvStream.write(data);
	}
};