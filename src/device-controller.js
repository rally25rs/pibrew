'use strict';

const _ = require('lodash');
const Pid = require('./pid');
const RelayController = require('./relay-controller');

const defaults = Object.freeze({
	setPoint: 0,
	setPointRange: 0,
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
		this._active = pidValue < this._configuration.setPointRange;
		this._relayController.mode(this._active ? 'on' : 'off');
	}
};
