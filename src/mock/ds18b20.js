'use strict';

exports.sensors = function(callback) {
	setTimeout(function() {
		callback(undefined, ['one', 'two']);
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
