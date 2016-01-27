'use strict';

const _ = require('lodash');
const Pid = require('./pid');

const defaultConfiguration = Object.freeze({
	setPoint: 0,
	// tempSensorId: undefined,
	// proportionalGain: 0.2,
	// integralGain: 0.2,
	// differentialGain: 5,
	gpio: undefined,
	gpioPin: 17
});

module.exports = class {
	constructor(configuration) {
		this._mode = 'off';
		this._configuration = _.extend({}, defaultConfiguration, configuration || {});
		this._active = false;
	}

	_onModeChanged() {
		if(this._mode === 'on') {
			this._configuration.gpio.write(this._configuration.gpioPin, 1);
		} else if(this._mode === 'off') {
			this._configuration.gpio.write(this._configuration.gpioPin, 0);
		}
	}

	start() {
		debugger;
		this._configuration.gpio.open(this._configuration.gpioPin, 'outbound');
	}

	stop() {
		this._configuration.gpio.close(this._configuration.gpioPin, function(error) {
			if(error) {
				this._mode = 'error';
			}
		});
	}

	mode(newMode) {
		if(newMode) {
			this._mode = newMode;
			this._onModeChanged();
		}
		return this._mode;
	}

	active() {
		return this._active;
	}

	update() {
		var pidValue = this._configuration._pid.update();
		this._active = pidValue < this._configuration.setPoint + 0.5;
	}
};
