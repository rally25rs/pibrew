'use strict';

var config = require('./config');

if(config.env === 'prod') {
	const libgpio = require('node-libgpiod');
	const chip = libgpio.Chip(0);
	const lines = {};

	module.exports = {
		export: function(gpioPin, forOutput = true) {
			lines[gpioPin] = new libgpio.Line(chip, gpioPin);
			if (forOutput) {
				lines[gpioPin].requestOutputMode();
			}
		},

		unexport: function(gpioPin) {
			delete lines[gpioPin];
		},

		read: function(gpioPin, callback) {
			lines[gpioPin].getValue();
			if (callback) {
				callback();
			}
		},

		write: function(gpioPin, value, callback) {
			lines[gpioPin].setValue(value);
			if (callback) {
				callback();
			}
		},
	}
} else {
	console.log('Using mock gpio.');
	module.exports = require('./mock/pi-gpio');
}
