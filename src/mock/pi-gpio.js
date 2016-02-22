'use strict';

exports.open = function(pinNumber, options, callback) {
	if(callback) {
		callback();
	}
};

exports.close = function(pinNumber, callback) {
	if(callback) {
		callback();
	}
};

exports.setDirection = function(pinNumber, direction, callback) {
	console.log(`Pin ${pinNumber} direction set to ${direction}`);
	if(callback) {
		callback();
	}
};

exports.getDirection = function(pinNumber, callback) {
	if(callback) {
		callback();
	}
};

exports.read = function (pinNumber, callback) {
	if(callback) {
		callback();
	}
};

exports.write = function(pinNumber, value, callback) {
	console.log(`Pin ${pinNumber} value set to ${value}`);
	if(callback) {
		callback();
	}
};
