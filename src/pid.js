'use strict';

var INTEGRAL_SUM_MIN = -20;
var INTEGRAL_SUM_MAX = 20;

var temperatureReader = require('./temperature-reader');

var Pid = function(setPoint, tempSensorId, proportionalGain, integralGain, differentialGain) {
	this._tempSensorId = tempSensorId;
	this._proportionalGain = proportionalGain;
	this._integralGain = integralGain;
	this._differentialGain = differentialGain;
	this._integratorSum = 0;
	this._differentialPrevious = undefined;
	this.setPoint = setPoint;
};

Pid.prototype.update = function() {
	var position = temperatureReader.temperature(this._tempSensorId);
	var error = this.setPoint - position;

	var proportioonalComponent = this._proportional(position, error);
	var integralComponent = this._integral(position, error);
	var differentialComponent = this._differential(position, error);

	this.value = proportioonalComponent + integralComponent + differentialComponent;
	return this.value;
};

Pid.prototype._proportional = function(position, error) {
	return this._proportionalGain * error;
};

Pid.prototype._integral = function(position, error) {
	this._integratorSum += error;

	if(this._integratorSum > INTEGRAL_SUM_MAX) {
		this._integratorSum = INTEGRAL_SUM_MAX;
	} else if(this._integratorSum < INTEGRAL_SUM_MIN) {
		this._integratorSum = INTEGRAL_SUM_MIN;
	}

	return this._integralGain * this._integratorSum;
};

Pid.prototype._differential = function(position, error) {
	var differentialComponent;

	if(this._differentialPrevious === undefined) {
		this._differentialPrevious = position;
	}

	differentialComponent = this._differentialGain * (position - this._differentialPrevious);

	this._differentialPrevious = position;
	return differentialComponent;
};

module.exports = Pid;