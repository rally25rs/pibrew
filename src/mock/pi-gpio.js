'use strict';

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

exports.unexport = function() {
};
