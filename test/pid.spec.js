'use strict';

const expect = require('chai').expect;
const Pid = require('../src/pid');
const mockTemperatureReader = {
	temperature: function() {
		return 0;
	}
};

function makeConfiguration(tempSensorId, proportionalGain, integralGain, differentialGain) {
	return {
		tempSensorId: tempSensorId,
		heating: {
			proportionalGain: proportionalGain,
			integralGain: integralGain,
			differentialGain: differentialGain			
		},
		cooling: {
			proportionalGain: proportionalGain,
			integralGain: integralGain,
			differentialGain: differentialGain			
		}
	};
}

describe('PID Controller', function() {
	describe('proportional calculation', function() {
		it('returns positive value when input is below setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 2, 0, 0));
			var result = pid._proportional(2, pid._configuration.heating);
			expect(result).is.greaterThan(0);
		});

		it('returns negative value when input is above setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 2, 0, 0));
			var result = pid._proportional(-2, pid._configuration.cooling);
			expect(result).is.lessThan(0);
		});

		it('returns 0 when input is at setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 2, 0, 0));
			var result = pid._proportional(0, pid._configuration.heating);
			expect(result).to.equal(0);
		});
	});

	describe('integral calculation', function() {
		it('returns positive value when input is below setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 2, 0));
			pid._integral(2, pid._configuration.heating);
			var result = pid._integral(1, pid._configuration.heating);
			expect(result).is.greaterThan(0);
		});

		it('increases return value when error is increasing', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 0.5, 0));
			pid._integral(1, pid._configuration.heating);
			var result1 = pid._integral(2, pid._configuration.heating);
			var result2 = pid._integral(3, pid._configuration.heating);
			expect(result1).is.lessThan(result2);
		});

		it('returns negative value when input is above setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 2, 0));
			pid._integral(-2, pid._configuration.heating);
			var result = pid._integral(-1, pid._configuration.cooling);
			expect(result).is.lessThan(0);
		});

		it('returns 0 when input is at setpoint', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 2, 0));
			pid._integral(0, pid._configuration.heating);
			var result = pid._integral(0, pid._configuration.heating);
			expect(result).to.equal(0);
		});
	});

	describe('differential calculation', function() {
		it('returns negative value when error is decreasing', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 0, 2));
			pid._differential(8, pid._configuration.heating);
			var result = pid._differential(7, pid._configuration.heating);
			expect(result).is.lessThan(0);
		});

		it('returns positive value when error is increasing', function() {
			var pid = new Pid(10, mockTemperatureReader, makeConfiguration('test', 0, 0, 2));
			pid._differential(7, pid._configuration.heating);
			var result = pid._differential(8, pid._configuration.heating);
			expect(result).is.greaterThan(0);
		});
	});

	it('stabilizes a system with some lag', function() {
		var pidOutputs = [];
		var currentTemperature = 70;
		var setPoint = 170;
		var mockTemperatureReader2 = {
			temperature: function() {
				return currentTemperature;
			}
		};
		var pid = new Pid(setPoint, mockTemperatureReader2, makeConfiguration('test', 0.2, 0.2, 1));
		var lastPidOutput;

		for(var i = 0; i < 1000; i++) {
			lastPidOutput = pid.update();

			pidOutputs.push(lastPidOutput);
			if(pidOutputs.length === 5) {
				currentTemperature += (pidOutputs.shift() * 0.1);
			}
		}

		expect(currentTemperature).to.be.lessThan(setPoint + 1);
		expect(currentTemperature).to.be.greaterThan(setPoint - 1);
	});

	describe('preventOvershoot', function() {
		function makePreventOvershootConfiguration(overshootEstimate) {
			return {
				tempSensorId: 'test',
				proportionalGain: 1,
				integralGain: 1,
				differentialGain: 1,
				preventOvershoot: true,
				overshootEstimate: overshootEstimate
			};
		}

		function makeMockTempReader(temperatures) {
			var temperatureGenerator = (function*() {
				for(var i =0; i < temperatures.length; i++) {
					yield temperatures[i];
				}
			}());

			return {
				temperature: function() {
					return temperatureGenerator.next().value;
				}
			};
		}

		it('stays on if below overshoot setpoint and temp rising', function() {
			var pid = new Pid(10, makeMockTempReader([2, 3]), makePreventOvershootConfiguration(5));
			pid.update();
			pid.update();

			expect(pid.preventOvershoot).to.be.true;
		});

		it('stays on if below overshoot setpoint and temp falling', function() {
			var pid = new Pid(10, makeMockTempReader([3, 2]), makePreventOvershootConfiguration(5));
			pid.update();
			pid.update();

			expect(pid.preventOvershoot).to.be.true;
		});

		it('stays on if between overshoot setpoint and config setpoint and temp rising', function() {
			var pid = new Pid(10, makeMockTempReader([6, 7]), makePreventOvershootConfiguration(5));
			pid.update();
			pid.update();

			expect(pid.preventOvershoot).to.be.true;
		});

		it('turns off if between overshoot setpoint and config setpoint and temp falling', function() {
			var pid = new Pid(10, makeMockTempReader([7, 6]), makePreventOvershootConfiguration(5));
			pid.update();
			pid.update();

			expect(pid.preventOvershoot).to.be.false;
		});

		it('turns off if temp rises above setpoint', function() {
			var pid = new Pid(10, makeMockTempReader([4, 7, 11]), makePreventOvershootConfiguration(5));
			pid.update();
			pid.update();
			pid.update();

			expect(pid.preventOvershoot).to.be.false;
		});
	});
});
