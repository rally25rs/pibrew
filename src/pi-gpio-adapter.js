'use strict';

var config = './config';

if(config.env === 'prod') {
	var gpio = require('pi-gpio');
} else {
	var gpio = require('./mock/pi-gpio');
}

module.exports = gpio;
