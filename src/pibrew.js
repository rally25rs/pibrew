'use strict';

const config = require('./config');
const TemperatureReader = require('./temperature-reader');
const gpio = require('./pi-gpio-adapter');
const DeviceController = require('./device-controller');
const sensorsAdapter = require('./ds18b20-adapter');
const Web = require('./web');

var exiting = false;
var devices = [];
var deviceUpdateIntervalId;
var temperatureReader = new TemperatureReader(sensorsAdapter);
var web = new Web(config.web);


function _initializeDevice(deviceConfig) {
	deviceConfig.relay.gpio = gpio;
	deviceConfig.temperatureReader = temperatureReader;
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
	devices.forEach((device) => device.start());
	web.start();
}

function cleanup() {
	clearInterval(deviceUpdateIntervalId);
	temperatureReader.stop();
	devices.forEach((device) => device.stop());
	web.stop();
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