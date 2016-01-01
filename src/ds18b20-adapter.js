'use strict';

var config = './config';

if(config.env === 'prod') {
	var ds18b20 = require('ds18b20');
} else {
	var ds18b20 = require('./mock/ds18b20');
}

module.exports = ds18b20;
