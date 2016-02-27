'use strict';

const _ = require('lodash');
const Pid = require('./pid');
const RelayController = require('./relay-controller');

const defaults = Object.freeze({
	setPoint: 0,
	setPointRange: .2,
	temperatureReader: undefined
});

module.exports = class {
	constructor(configuration) {
		this._configuration = _.extend({}, defaults, configuration);

		this._pid = new Pid(configuration.setPoint, configuration.temperatureReader, configuration.pid);
		this._relayController = new RelayController(configuration.relay);
	}

	start() {
		this._relayController.start();
	}

	stop() {
		this._relayController.stop();
	}

	update() {
		var pidValue = this._pid.update();
		console.log(`Pid value: ${pidValue}, SetPoint: ${this._configuration.setPoint}`);
		var prevMode = this._relayController.mode();
		var newMode = prevMode;
		if(prevMode === 'on') {
			if(pidValue < this._configuration.setPointRange * -1) {
				newMode = 'off';
			}
		} else {
			if(pidValue > this._configuration.setPointRange) {
				newMode = 'on';
			}
		}
		this._active = newMode === 'on';
		this._relayController.mode(newMode);
	}
};
