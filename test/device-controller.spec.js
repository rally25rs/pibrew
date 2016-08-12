'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
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
		it('enables relay if pid reports higher than 0', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader,
				initialMode: 'auto'
			};

			const mockPid = function() {
				return {
					update: function() { return 1; }
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

		it('disables relay if pid reports lower than 0', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader,
				initialMode: 'auto'
			};

			const mockPid = function() {
				return {
					update: function() { return -1; }
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

		it('disables relay if pid reports higher than 0 but within configured range', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0.5,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader,
				initialMode: 'auto'
			};

			const mockPid = function() {
				return {
					update: function() { return 0.2; }
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

		it('disables relay if pid reports lower than 0 but within configured range', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0.5,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader
			};

			const mockPid = function() {
				return {
					update: function() { return -0.4; }
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

		it('disables relay if pid goes higher than configured range then returns to within range', () => {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0.5,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader,
				initialMode: 'auto'
			};

			var pidValue = 0;

			const mockPid = function() {
				return {
					update: function() { return pidValue; }
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			const deviceController = new DeviceController(deviceConfiguration);

			expect(deviceController._relayController.mode()).to.equal('off');
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('off');
			pidValue = 1;
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('on');
			pidValue = 0.2;
			deviceController.update();
			expect(deviceController._relayController.mode()).to.equal('off');
		});
	});

	describe('writeConfig', function() {
		beforeEach(function() {
			const deviceConfiguration = {
				setPoint: 100,
				setPointRange: 0,
				pid: {},
				relay: {
					gpio: gpio,
					gpioPin: 17
				},
				mockTemperatureReader: mockTemperatureReader,
				initialMode: 'auto'
			};

			const mockPid = function() {
				return {
					update: function() { return 1; },
					setSetpoint: function() {}
				};
			};

			const DeviceController = proxyquire('../src/device-controller', {
				'./pid': mockPid
			});

			this.deviceController = new DeviceController(deviceConfiguration);
		});


		it('includes changed setPoint', function() {
			this.deviceController.setSetpoint(123);
			expect(this.deviceController.writeConfig().setPoint).to.equal(123);
		});

		it('includes changed initialMode', function() {
			this.deviceController.setMode('on');
			expect(this.deviceController.writeConfig().initialMode).to.equal('on');
		});
	});
});
