'use strict';

var _ = require('lodash');
var Pid = require('./pid');

var defaultConfiguration = {
	setPoint: 0,
	tempSensorId: undefined,
	proportionalGain: 0.2,
	integralGain: 0.2,
	differentialGain: 5
};

var RelayController = function(configuration) {
	this._mode = 'off';
	this._configuration = _.extend(defaultConfiguration, configuration || {});
	this._pid = new Pid(this._configuration.setPoint, this._configuration.tempSensorId, this._configuration.proportionalGain, this._configuration.integralGain, this._configuration.differentialGain);
	this._active = false;
};

RelayController.prototype.mode = function(newMode) {
	if(newMode) {
		this._mode = newMode;
	}
	return this._mode;
};

RelayController.prototype.active = function() {
	return this._active;
};

RelayController.prototype.update = function() {
	var pidValue = this._pid.update();
	this._active = pidValue < this._configuration.setPoint + 0.5;
};

module.exports = RelayController;
