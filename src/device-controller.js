'use strict';

const _ = require('lodash');
const Pid = require('./pid');
const RelayController = require('./relay-controller');

const defaults = Object.freeze({
	setPoint: 0,
	setPointRange: 0.2,
	temperatureReader: undefined,
	verbose: false
});

module.exports = class {
	constructor(configuration) {
		this._configuration = _.extend({}, defaults, configuration);

		this._mode = 'off';
		this._pid = new Pid(configuration.setPoint, configuration.temperatureReader, configuration.pid);
		this._relayController = new RelayController(configuration.relay);
	}

	start() {
		this._relayController.start();
	}

	stop() {
		this._relayController.stop();
		this._pid.stop();
	}

	getStatus() {
		return {
			name: this._configuration.name,
			setPoint: this._configuration.setPoint,
			currentTemp: this._configuration.temperatureReader.temperature(this._configuration.pid.tempSensorId),
			mode: this._mode,
			active: this._active
		};
	}

	setMode(mode) {
		this._mode = mode;
		this.update();
	}

	update() {
		var pidValue = this._pid.update();		
		var prevMode = this._relayController.mode();
		var newActive = prevMode;

		if(this._configuration.verbose) {
			console.log(`Mode: ${this._mode}, Pid value: ${pidValue}, SetPoint: ${this._configuration.setPoint}`);
		}

		if(this._mode === 'auto' && prevMode === 'on') {
			if(pidValue < this._configuration.setPointRange * -1) {
				newActive = 'off';
			}
		} else if(this._mode === 'auto') {
			if(pidValue > this._configuration.setPointRange) {
				newActive = 'on';
			}
		} else {
			newActive = this._mode;
		}

		this._active = newActive === 'on';
		this._relayController.mode(newActive);
	}
};
