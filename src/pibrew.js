'use strict';

const config = require('./config');
const temperatureReader = require('./temperature-reader');
const gpio = require('./pi-gpio-adapter');
const DeviceController = require('./device-controller');

var exiting = false;
var devices = [];
var deviceUpdateIntervalId;

function _initializeDevice(deviceConfig) {
	deviceConfig.relay.gpio = gpio;
	var deviceController = new DeviceController(deviceConfig);
	devices.push(deviceController);
}

function _updateDevices() {
	devices.forEach((device) => device.update());
}

function start() {
	temperatureReader.start(config.poll);
	config.devices.forEach(_initializeDevice);
	deviceUpdateIntervalId = setInterval(_updateDevices, config.poll);
}

function cleanup() {
	temperatureReader.stop();
	clearInterval(deviceUpdateIntervalId);
}

function exit() {
	if(!exiting)
	{
		cleanup();
		process.exit(0);
	}
	exiting = true;
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGTKILL', exit);

start();