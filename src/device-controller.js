'use strict';

const _ = require('lodash');
const Pid = require('./pid');
const RelayController = require('./relay-controller');

const defaults = Object.freeze({
	setPoint: 0,
	setPointRange: 0.2,
	temperatureReader: undefined
});

module.exports = class {
	constructor(configuration) {
		this._configuration = _.extend({}, defaults, configuration);

		this._pid = new Pid(configuration.setPoint, configuration.pid.tempSensorId, configuration.pid.proportionalGain, configuration.pid.integralGain, configuration.pid.differentialGain, configuration.temperatureReader);
		this._relayController = new RelayController(configuration.relay);
	}

	update() {
		var pidValue = this._pid.update();
		this._active = pidValue < this._configuration.setPoint - this._configuration.setPointRange;
		this._relayController.mode(this._active ? 'on' : 'off');
	}
};
