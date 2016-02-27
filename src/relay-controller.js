'use strict';

const _ = require('lodash');
const Pid = require('./pid');

const defaultConfiguration = Object.freeze({
	gpio: undefined,
	gpioPin: 17,
	verbose: false
});

module.exports = class {
	constructor(configuration) {
		this._mode = 'off';
		this._configuration = _.extend({}, defaultConfiguration, configuration || {});
		this._active = false;
	}

	_onModeChanged() {
		const value = this._mode === 'on' ? 1 : 0;
		if(this._configuration.verbose) {
			console.log(`Relay on GPIO ${this._configuration.gpioPin} set to ${value}.`);
		}
		this._configuration.gpio.write(this._configuration.gpioPin, value);
	}

	start() {
		this._configuration.gpio.export(this._configuration.gpioPin, 'out');
	}

	stop() {
		this._configuration.gpio.unexport(this._configuration.gpioPin);
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
};
