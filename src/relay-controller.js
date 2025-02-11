'use strict';

const _ = require('lodash');
const DataLogger = require('./data-logger');

const defaultConfiguration = Object.freeze({
	gpio: undefined,
	gpioPin: 17,
	verbose: false,
	log: 'logs/relay.csv'
});

module.exports = class {
	constructor(configuration) {
		this._mode = 'off';
		this._configuration = _.extend({}, defaultConfiguration, configuration || {});
		this._active = false;
		this._dataLogger = new DataLogger(this._configuration.log);
	}

	_onModeChanged() {
		const value = this._mode === 'on' ? 1 : 0;
		if(this._configuration.verbose) {
			console.log(`Relay on GPIO ${this._configuration.gpioPin} set to ${value}.`);
		}
		this._dataLogger.write({
			date: this._dataLogger.now(),
			value: value
		});
		this._configuration.gpio.write(this._configuration.gpioPin, value);
	}

	start() {
		this._configuration.gpio.export(this._configuration.gpioPin);
	}

	stop() {
		this._configuration.gpio.unexport(this._configuration.gpioPin);
		this._dataLogger.stop();
	}

	mode(newMode) {
		if(newMode !== undefined && newMode !== this._mode) {
			this._mode = newMode;
			this._onModeChanged();
		}
		return this._mode;
	}

	active() {
		return this._active;
	}
};
