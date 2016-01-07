'use strict';

var INTEGRAL_SUM_MIN = -10;
var INTEGRAL_SUM_MAX = 10;

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

	var proportioonalComponent = this._proportional(error);
	var integralComponent = this._integral(error);
	var differentialComponent = this._differential(position);

	this.value = proportioonalComponent + integralComponent + differentialComponent;
	return this.value;
};

Pid.prototype._proportional = function(error) {
	return this._proportionalGain * error;
};

Pid.prototype._integral = function(error) {
	this._integratorSum += error;

	if(this._integratorSum > INTEGRAL_SUM_MAX) {
		this._integratorSum = INTEGRAL_SUM_MAX;
	} else if(this._integratorSum < INTEGRAL_SUM_MIN) {
		this._integratorSum = INTEGRAL_SUM_MIN;
	}

	return this._integralGain * this._integratorSum;
};

Pid.prototype._differential = function(position) {
	var differentialComponent;

	if(this._differentialPrevious === undefined) {
		this._differentialPrevious = position;
	}

	differentialComponent = this._differentialGain * (position - this._differentialPrevious);

	this._differentialPrevious = position;
	return differentialComponent;
};

module.exports = Pid;