'use strict';

var temps = {};

function _getTempFor(id) {
	if(!temps[id]) {
		temps[id] = 0;
	}
	temps[id] += 1;
	return temps[id];
}

exports.sensors = function(callback) {
	setTimeout(function() {
		callback(undefined, ['28-011564c2ffff']);
	}, 0);
};

exports.temperature = function(id, callback) {
	setTimeout(function() {
		// callback(undefined, Math.random() * 100);
		callback(undefined, _getTempFor(id));
	}, 0);
};

exports.temperatureSync = function(id) {
	// return Math.random() * 100;
	return _getTempFor(id);
};
