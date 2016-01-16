'use strict';

var config = require('./config');

if(config.env === 'prod') {
	module.exports = require('ds18b20');
} else {
	console.log('Using mock temperatures.');
	module.exports = require('./mock/ds18b20');
}
