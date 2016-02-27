'use strict';

exports.sensors = function(callback) {
	setTimeout(function() {
		callback(undefined, ['28-011564c2ffff']);
	}, 0);
};

exports.temperature = function(id, callback) {
	setTimeout(function() {
		callback(undefined, Math.random() * 100);
	}, 0);
};

exports.temperatureSync = function(id) {
	return Math.random() * 100;
};
