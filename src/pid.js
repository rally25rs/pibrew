'use strict';

const _ = require('lodash');
const DataLogger = require('./data-logger');

const INTEGRAL_SUM_MIN = -5;
const INTEGRAL_SUM_MAX = 5;

const defaults = Object.freeze({
	tempSensorId: undefined,
	proportionalGain: 0,
	integralGain: 0,
	differentialGain: 0,
	verbose: false,
	log: 'logs/pid.csv'
});

module.exports = class {
	constructor(setPoint, temperatureReader, configuration) {
		this._configuration = _.extend({}, defaults, configuration);
		this._integratorSum = 0;
		this._differentialPrevious = undefined;
		this._temperatureReader = temperatureReader;
		this._dataLogger = new DataLogger(this._configuration.log);
		this.setPoint = setPoint;
	}

	update() {
		var position = this._temperatureReader.temperature(this._configuration.tempSensorId);
		var error = this.setPoint - position;

		var proportionalComponent = this._proportional(error);
		var integralComponent = this._integral(error);
		var differentialComponent = this._differential(position);

		this.value = proportionalComponent + integralComponent + differentialComponent;

		if(this._configuration.verbose) {
			console.log(`position: ${position}, proportionalComponent: ${proportionalComponent}, integralComponent: ${integralComponent}, differentialComponent: ${differentialComponent}, result: ${this.value}`);
		}
		this._dataLogger.write({
			time: this._dataLogger.now(),
			setPoint: this.setPoint,
			position: position,
			proportional: proportionalComponent,
			integral: integralComponent,
			differential: differentialComponent,
			output: this.value
		});

		return this.value;
	}

	stop() {
		this._dataLogger.stop();
	}

	_proportional(error) {
		return this._configuration.proportionalGain * error;
	}

	_integral(error) {
		this._integratorSum += error;

		if(this._integratorSum > INTEGRAL_SUM_MAX) {
			this._integratorSum = INTEGRAL_SUM_MAX;
		} else if(this._integratorSum < INTEGRAL_SUM_MIN) {
			this._integratorSum = INTEGRAL_SUM_MIN;
		}

		return this._configuration.integralGain * this._integratorSum;
	}

	_differential(position) {
		var differentialComponent;

		if(this._differentialPrevious === undefined) {
			this._differentialPrevious = position;
		}

		differentialComponent = this._configuration.differentialGain * (this._differentialPrevious - position);

		this._differentialPrevious = position;
		return differentialComponent;
	}
};