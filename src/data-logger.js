'use strict';

const fs = require('fs');
const csv = require('fast-csv');

var csvStream, writableStream;

module.exports = class {
	constructor(logPath) {
		csvStream = csv.createWriteStream({headers: true});
	    writableStream = fs.createWriteStream(logPath);

		csvStream.pipe(writableStream);
	}

	stop() {
		csvStream.end();
		writableStream.end();
	}

	now() {
		var now = new Date();
		return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	}

	write(data) {
		csvStream.write(data);
	}
};