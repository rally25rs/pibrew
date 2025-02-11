'use strict';

const _ = require('lodash');

module.exports = class {
	constructor(sensorsAdapter) {
		this._pollTIme = undefined;
		this._timerId = undefined;
		this._temperatures = {};
		this._sensorIds = [];
		this._sensorsAdapter = sensorsAdapter;
	}

	_readTemperatures() {
		this._sensorIds.forEach((sensorId) => {
			// console.log('Getting temp for sensor ' + sensorId);
			this._sensorsAdapter.temperature(sensorId, (err, value) => {
				this._saveTemperature(sensorId, err, value);
			});
		});

		this._timerId = setTimeout(this._readTemperatures.bind(this), this._pollTIme);
	}

	_saveSensors(err, ids) {
		if(err) {
			//todo:log
		} else {
			this._sensorIds = ids;
		}
	}

	_saveTemperature(id, err, value) {
		var degreesFahrenheit;

		if(err) {
			// todo: log
			console.error(`Error getting temperature got sensor id ${id}; ${err}`);
			this._temperatures[id] = 0;
		} else {
			degreesFahrenheit = this._celciusToFahrenheit(value);
			this._temperatures[id] = degreesFahrenheit;
			// console.log('Temp of sensor [' + id + '] = ' + degreesFahrenheit);
		}
	}

	_celciusToFahrenheit(degreesCelcius) {
		var degreesFahrenheit = degreesCelcius * 1.8 + 32;
		degreesFahrenheit = Math.round(degreesFahrenheit * 10) / 10;
		return degreesFahrenheit;
	}

	start(pollTimeMS) {
		this._pollTIme = pollTimeMS;
		var self = this;
		this._sensorIds = this._sensorsAdapter.sensors((err, ids) => {
			this._saveSensors(err, ids);
			this._readTemperatures();
		});
	}

	stop() {
		clearTimeout(this._timerId);
	}

	temperatures() {
		return this._temperatures;
	}

	temperature(id) {
		return this._temperatures[id] || 0;
	}
};