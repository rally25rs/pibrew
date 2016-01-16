'use strict';

var _ = require('lodash');
var config = require('./config');
var sensorsAdapter = require('./ds18b20-adapter');

var pollTIme;
var timerId;
var temperatures = {};
var sensorIds = [];

function _readTemperatures() {
	_.each(sensorIds, function(sensorId) {
		console.log('Getting temp for sensor ' + sensorId);
		sensorsAdapter.temperature(sensorId, function(err, value) {
			_saveTemperature(sensorId, err, value);
		});
	});

	timerId = setTimeout(_readTemperatures, pollTIme);
}

function _saveSensors(err, ids) {
	if(err) {
		//todo:log
	} else {
		sensorIds = ids;
	}
}

function _saveTemperature(id, err, value) {
	var degreesFahrenheit;

	if(err) {
		// todo: log
		temperatures[config.sensors[id]] = 0;
	} else {
		degreesFahrenheit = _celciusToFahrenheit(value);
		temperatures[config.sensors[id]] = degreesFahrenheit;
		console.log('Temp of sensor [' + config.sensors[id] + '] = ' + degreesFahrenheit);
	}
}

function _celciusToFahrenheit(degreesCelcius) {
	var degreesFahrenheit = degreesCelcius * 1.8 + 32;
	degreesFahrenheit = Math.round(degreesFahrenheit * 10) / 10;
	return degreesFahrenheit;
}

exports.start = function(pollTimeMS) {
	pollTIme = pollTimeMS;
	sensorIds = sensorsAdapter.sensors(function (err, ids) {
		console.log('Got sensors');
		_saveSensors(err, ids);
		_readTemperatures();
	});
};

exports.stop = function() {
	clearTimeout(timerId);
};

exports.temperatures = function() {
	return temperatures;
};

exports.temperature = function(id) {
	return temperatures[id] || 0;
};