'use strict';

const _ = require('lodash');
const DataLogger = require('./data-logger');

const INTEGRAL_SUM_MIN = -2;
const INTEGRAL_SUM_MAX = 2;

const defaults = Object.freeze({
	tempSensorId: undefined,
	proportionalGain: 0,
	integralGain: 0,
	differentialGain: 0,
	verbose: false,
	log: 'logs/pid.csv',
	maxIntegralIterations: 4,
	overshootMax: 0,
	overshootPerPoll: 0
});

module.exports = class {
	constructor(setPoint, temperatureReader, configuration) {
		this._configuration = _.extend({}, defaults, configuration);
		this._integratorSum = 0;
		this._integratorIterations = [];
		this._differentialPrevious = undefined;
		this._temperatureReader = temperatureReader;
		this._dataLogger = new DataLogger(this._configuration.log);
		this._overshootEstimate = 0;
		this.setPoint = setPoint;
		this.overshootSetPoint = setPoint;
		this._preventOvershoot = this._configuration.overshootMax > 0;
		this.previousPosition = undefined;
	}

	setSetpoint(setPoint) {
		this.setPoint = setPoint;
	}

	update() {
		var position = this._temperatureReader.temperature(this._configuration.tempSensorId, { parser: 'preciseDecimal' });
		this.overshootSetPoint = this._preventOvershoot ? (this.overshootSetPoint - this._configuration.overshootPerPoll) : this.setPoint;
		var error = this.overshootSetPoint - position;

		var proportionalComponent = this._proportional(error);
		var integralComponent = this._integral(error);
		var differentialComponent = this._differential(error);

		this.value = proportionalComponent + integralComponent + differentialComponent;

		if(this._configuration.verbose) {
			console.log(`position: ${position}, proportionalComponent: ${proportionalComponent}, integralComponent: ${integralComponent}, differentialComponent: ${differentialComponent}, result: ${this.value}`);
		}
		this._dataLogger.write({
			time: this._dataLogger.now(),
			setPoint: this.setPoint,
			preventOvershoot: this._preventOvershoot,
			overshootSetPoint: this.overshootSetPoint,
			error: error,
			position: position,
			proportional: proportionalComponent,
			integral: integralComponent,
			differential: differentialComponent,
			output: this.value
		});

		if(this.previousPosition === undefined) {
			this.previousPosition = position;
		}

		if(this._preventOvershoot) {
			if((position > this.overshootSetPoint && position < this.previousPosition) || position > this.setPoint) {
				this._preventOvershoot = false;
			}			
		} else {
			if(this.value > 0) {
				this._preventOvershoot = true;
			}			
		}

		this.previousPosition = position;
		return this.value;
	}

	setPoint(value) {
		this.setPoint = value;
		this._preventOvershoot = this._overshootEstimate > 0;
	}

	stop() {
		this._dataLogger.stop();
	}

	_proportional(error) {
		return this._configuration.proportionalGain * error;
	}

	_integral(error) {
		var scaledError = error * this._configuration.integralGain;
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

	_differential(error) {
		var differentialComponent;

		if(this._differentialPrevious === undefined) {
			this._differentialPrevious = error;
		}

		differentialComponent = (this._configuration.differentialGain * (this._differentialPrevious - error)) * -1;

		this._differentialPrevious = error;
		return differentialComponent;
	}
};