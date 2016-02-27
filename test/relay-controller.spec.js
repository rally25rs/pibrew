'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const gpioAdapter = require('../src/mock/pi-gpio');
const expect = chai.expect;
const RelayController = require('../src/relay-controller');
chai.use(sinonChai);

describe('RelayController', function() {
	var mocks;

	beforeEach(function() {
		mocks = sinon.collection;
	});

	afterEach(function() {
		mocks.restore();
	});

	describe('mode', function() {
		it('"on" activates gpio pin', function() {
			const gpioPin = 2;
			const mockPid = function() {
				this.update = function() {
					return 0;
				};
			};

			const mockGpioAdapter = mocks.mock(gpioAdapter);
			mockGpioAdapter.expects('write').once().calledWith(gpioPin, 1);

			const relayController = new RelayController({
				gpio: gpioAdapter,
				gpioPin: gpioPin,
				pid: mockPid
			});
			relayController.start();
			relayController.mode('on');

			mockGpioAdapter.verify();
		});

		it('"off" deactivates gpio pin', function() {
			const gpioPin = 2;
			const mockPid = function() {
				this.update = function() {
					return 0;
				};
			};

			const mockGpioAdapter = mocks.mock(gpioAdapter);
			mockGpioAdapter.expects('write').once().calledWith(gpioPin, 0);

			const relayController = new RelayController({
				gpio: gpioAdapter,
				gpioPin: gpioPin,
				pid: mockPid
			});
			relayController.start();
			relayController.mode('off');

			mockGpioAdapter.verify();
		});
	});
});
