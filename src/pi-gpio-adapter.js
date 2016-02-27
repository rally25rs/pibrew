'use strict';

var config = require('./config');

if(config.env === 'prod') {
	module.exports = require('pi-gpioutil');
} else {
	console.log('Using mock gpio.');
	module.exports = require('./mock/pi-gpio');
}
