'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
//const DeviceController = require('../src/device-controller');
const RelayController = require('../src/relay-controller');
const gpio = require('../src/mock/pi-gpio');
const proxyquire =  require('proxyquire');
chai.use(sinonChai);

const mockTemperatureReader = {
	temperature: function() {
		return 0;
	}
};

describe('DeviceController', () => {
	describe('update', () => {
		it('enables relay if pid reports lower than setpoint', () => {
			const deviceConfiguration = {
				setPoint: 100,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 1
				},
				mockTemperatureReader: mockTemperatureReader
			};

			const mockPid = function() {
				return {
					update: function() { return 99; }
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			const deviceController = new DeviceController(deviceConfiguration);
			expect(deviceController._relayController.mode()).to.equal('off');
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('on');
		});

		it('disables relay if pid reports higher than setpoint', () => {
			const deviceConfiguration = {
				setPoint: 100,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 1
				},
				mockTemperatureReader: mockTemperatureReader
			};

			const mockPid = function() {
				return {
					update: function() { return 101; }
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			const deviceController = new DeviceController(deviceConfiguration);
			expect(deviceController._relayController.mode()).to.equal('off');
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('off');
		});

		it('disables relay if pid reports lower than setpoint but within configured range', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0.5,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 1
				},
				mockTemperatureReader: mockTemperatureReader
			};

			const mockPid = function() {
				return {
					update: function() { return 99.6; }
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			const deviceController = new DeviceController(deviceConfiguration);
			expect(deviceController._relayController.mode()).to.equal('off');
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('off');
		});

		it('disables relay if pid reports higher than setpoint but within configured range', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0.5,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 1
				},
				mockTemperatureReader: mockTemperatureReader
			};

			const mockPid = function() {
				return {
					update: function() { return 100.4; }
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			const deviceController = new DeviceController(deviceConfiguration);
			expect(deviceController._relayController.mode()).to.equal('off');
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('off');
		});
	});
});
