'use strict';

const _ = require('lodash');
const config = require('./config');
const TemperatureReader = require('./temperature-reader');
const gpio = require('./pi-gpio-adapter');
const DeviceController = require('./device-controller');
const sensorsAdapter = require('./ds18b20-adapter');
const web = require('./web');
const fs = require('fs');

const SESSION_CONFIG_FILE = 'sessionconfig.json'

var exiting = false;
var devices = [];
var deviceUpdateIntervalId;
var temperatureReader = new TemperatureReader(sensorsAdapter);

function _initializeDevice(deviceConfig) {
	deviceConfig.relay.gpio = gpio;
	deviceConfig.temperatureReader = temperatureReader;
	var deviceController = new DeviceController(deviceConfig);
	devices.push(deviceController);
}

function _updateDevices() {
	devices.forEach((device) => device.update());
	web.emitUpdate();
}

function getStatus() {
	return {
		devices: devices.map(function (deviceController) {
			return deviceController.getStatus();
		})
	};
}

function readSessionConfig() {
	try {
		if (fs.existsSync(SESSION_CONFIG_FILE))
		{
			return JSON.parse(fs.readFileSync(SESSION_CONFIG_FILE, { encoding: 'utf8' }));
		}
		return {};
	} catch (e) {
		console.error(e);
	}
}

function writeSessionConfig() {
	const sessionConfig = devices.map(function (deviceController) {
		return deviceController.writeConfig();
	});

	try {
		fs.writeFile(SESSION_CONFIG_FILE, JSON.stringify(sessionConfig), () => {});
	} catch (e) {
		console.error(e);
	}
}

function deleteSessionConfig() {
	try {
		fs.unlinkSync(SESSION_CONFIG_FILE);
	} catch (e) {
		// ignoring exception.
	}
}

function updateDeviceMode(deviceIndex, mode) {
	devices[deviceIndex].setMode(mode);
	writeSessionConfig();
}

function updateDeviceSetpoint(deviceIndex, setPoint) {
	devices[deviceIndex].setSetpoint(setPoint);
	writeSessionConfig();
}

function start() {
	const sessionConfig = readSessionConfig();
	if(sessionConfig && sessionConfig.length === config.devices.length) {
		for (var i = 0; i < config.devices.length; i++) {
			config.devices[i] = _.extend(config.devices[i], sessionConfig[i]);
		}
	}

	temperatureReader.start(config.poll);
	config.devices.forEach(_initializeDevice);
	deviceUpdateIntervalId = setInterval(_updateDevices, config.poll);
	devices.forEach((device) => device.start());
	web.init(config.web, getStatus, updateDeviceMode, updateDeviceSetpoint);
	web.start();
}

function cleanup() {
	clearInterval(deviceUpdateIntervalId);
	temperatureReader.stop();
	devices.forEach((device) => device.stop());
	web.stop();
	deleteSessionConfig();
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