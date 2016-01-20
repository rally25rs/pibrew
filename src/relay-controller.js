'use strict';

var _ = require('lodash');
var Pid = require('./pid');

var defaultConfiguration = {
	setPoint: 0,
	// tempSensorId: undefined,
	// proportionalGain: 0.2,
	// integralGain: 0.2,
	// differentialGain: 5,
	gpioPin: 17
};

var RelayController = function(configuration) {
	this._mode = 'off';
	this._configuration = _.extend(defaultConfiguration, configuration || {});
	this._active = false;
};

RelayController.prototype._onModeChanged = function() {
	if(this._mode === 'on') {
		this._configuration.gpio.write(this._configuration.gpioPin, 1);
	} else if(this._mode === 'off') {
		this._configuration.gpio.write(this._configuration.gpioPin, 0);
	}
};

RelayController.prototype.start = function() {
	this._configuration.gpio.open(this._configuration.gpioPin, 'outbound');
};

RelayController.prototype.stop = function() {
	this._configuration.gpio.close(this._configuration.gpioPin, function(error) {
		if(error) {
			this._mode = 'error';
		}
	});
};

RelayController.prototype.mode = function(newMode) {
	if(newMode) {
		this._mode = newMode;
		this._onModeChanged();
	}
	return this._mode;
};

RelayController.prototype.active = function() {
	return this._active;
};

RelayController.prototype.update = function() {
	var pidValue = this._configuration._pid.update();
	this._active = pidValue < this._configuration.setPoint + 0.5;
};

module.exports = RelayController;
