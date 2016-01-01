'use strict';

var exiting = false;
var config = require('./config');
var temperatureReader = require('./temperature-reader');

function start() {
	temperatureReader.start(config.poll);
}

function cleanup() {
	temperatureReader.stop();
}

function exit() {
	if(!exiting)
	{
		cleanup();
		process.exit(0);
	}
	exiting = true;
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGTKILL', exit);

start();