'use strict';

const _ = require('lodash');
const DataLogger = require('./data-logger');

const INTEGRAL_SUM_MIN = -2;
const INTEGRAL_SUM_MAX = 2;

const defaults = Object.freeze({
	tempSensorId: undefined,
	verbose: false,
	log: 'logs/pid.csv',
	maxIntegralIterations: 4,
	heating: {
		proportionalGain: 0,
		integralGain: 0,
		differentialGain: 0
	},
	cooling: {
		proportionalGain: 0,
		integralGain: 0,
		differentialGain: 0
	}
});

module.exports = class {
	constructor(setPoint, temperatureReader, configuration) {
		this._configuration = _.extend({}, defaults, configuration);
		this._integratorSum = 0;
		this._integratorIterations = [];
		this._differentialPrevious = undefined;
		this._temperatureReader = temperatureReader;
		this._dataLogger = new DataLogger(this._configuration.log);
		this.setPoint = setPoint;
		this.preventOvershoot = this._configuration.overshootEstimate > 0;
		this.previousPosition = undefined;
	}

	setSetpoint(setPoint) {
		this.setPoint = setPoint;
	}

	update() {
		var position = this._temperatureReader.temperature(this._configuration.tempSensorId, { parser: 'preciseDecimal' });
		var overshootSetPoint = this.setPoint - this._configuration.overshootEstimate;
		var error = (this.preventOvershoot ? overshootSetPoint : this.setPoint) - position;
		var config = this.error >= 0 ? this._configuration.heating : this._configuration.cooling;

		var proportionalComponent = this._proportional(error, config);
		var integralComponent = this._integral(error, config);
		var differentialComponent = this._differential(error, config);

		if(this.previousPosition === undefined) {
			this.previousPosition = position;
		}
		if((position > overshootSetPoint && position < this.previousPosition) || position > this.setPoint) {
			this.preventOvershoot = false;
		}

		this.value = proportionalComponent + integralComponent + differentialComponent;

		if(this._configuration.verbose) {
			console.log(`position: ${position}, proportionalComponent: ${proportionalComponent}, integralComponent: ${integralComponent}, differentialComponent: ${differentialComponent}, result: ${this.value}`);
		}
		this._dataLogger.write({
			time: this._dataLogger.now(),
			setPoint: this.setPoint,
			preventOvershoot: this.preventOvershoot,
			overshootSetPoint: overshootSetPoint,
			error: error,
			position: position,
			proportional: proportionalComponent,
			integral: integralComponent,
			differential: differentialComponent,
			output: this.value
		});

		this.previousPosition = position;
		return this.value;
	}

	setPoint(value) {
		this.setPoint = value;
		this.preventOvershoot = this._configuration.overshootEstimate > 0;
	}

	stop() {
		this._dataLogger.stop();
	}

	_proportional(error, config) {
		return config.proportionalGain * error;
	}

	_integral(error, config) {
		var scaledError = error * config.integralGain;
		this._integratorIterations.push(scaledError);
		if(this._integratorIterations.length > this._configuration.maxIntegralIterations) {
			this._integratorIterations.shift();
		}

		var _integratorSum = 0;
		for(var i = 0; i < this._integratorIterations.length; i++) {
			_integratorSum += this._integratorIterations[i];
		}

		if(_integratorSum > INTEGRAL_SUM_MAX) {
			_integratorSum = INTEGRAL_SUM_MAX;
		} else if(_integratorSum < INTEGRAL_SUM_MIN) {
			_integratorSum = INTEGRAL_SUM_MIN;
		}

		return _integratorSum;
	}

	_differential(error, config) {
		var differentialComponent;

		if(this._differentialPrevious === undefined) {
			this._differentialPrevious = error;
		}

		differentialComponent = (config.differentialGain * (this._differentialPrevious - error)) * -1;

		this._differentialPrevious = error;
		return differentialComponent;
	}
};