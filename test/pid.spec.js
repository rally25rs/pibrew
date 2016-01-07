'use strict';

var expect = require('chai').expect;
var proxyquire =  require('proxyquire');
var Pid = require('../src/pid');

describe('PID Controller', function() {
	describe('proportional calculation', function() {
		it('returns positive value when input is below setpoint', function() {
			var pid = new Pid(10, 'test', 2, 0, 0);
			var result = pid._proportional(2);
			expect(result).is.greaterThan(0);
		});

		it('returns negative value when input is above setpoint', function() {
			var pid = new Pid(10, 'test', 2, 0, 0);
			var result = pid._proportional(-2);
			expect(result).is.lessThan(0);
		});

		it('returns 0 when input is at setpoint', function() {
			var pid = new Pid(10, 'test', 2, 0, 0);
			var result = pid._proportional(0);
			expect(result).to.equal(0);
		});
	});

	describe('integral calculation', function() {
		it('returns positive value when input is below setpoint', function() {
			var pid = new Pid(10, 'test', 0, 2, 0);
			pid._integral(2);
			var result = pid._integral(1);
			expect(result).is.greaterThan(0);
		});

		it('increases return value when error is increasing', function() {
			var pid = new Pid(10, 'test', 0, 2, 0);
			pid._integral(5);
			var result1 = pid._integral(3);
			var result2 = pid._integral(2);
			expect(result1).is.lessThan(result2);
		});

		it('returns negative value when input is above setpoint', function() {
			var pid = new Pid(10, 'test', 0, 2, 0);
			pid._integral(-2);
			var result = pid._integral(-1);
			expect(result).is.lessThan(0);
		});

		it('returns 0 when input is at setpoint', function() {
			var pid = new Pid(10, 'test', 0, 2, 0);
			pid._integral(0);
			var result = pid._integral(0);
			expect(result).to.equal(0);
		});
	});

	describe('differential calculation', function() {
		it('returns positive value when input is below setpoint', function() {
			var pid = new Pid(10, 'test', 0, 0, 2);
			pid._differential(7);
			var result = pid._differential(8);
			expect(result).is.greaterThan(0);
		});

		it('returns negative value when input is above setpoint', function() {
			var pid = new Pid(10, 'test', 0, 0, 2);
			pid._differential(13);
			var result = pid._differential(12);
			expect(result).is.lessThan(0);
		});
	});

	it('stabilizes a system with some lag', function() {
		var pidOutputs = [];
		var currentTemperature = 70;
		var setPoint = 170;
		var mockTemperatureReader = {
			temperature: function() {
				return currentTemperature;
			}
		};
		var Pid = proxyquire('../src/pid', { './temperature-reader': mockTemperatureReader });
		var pid = new Pid(setPoint, 'test', 0.2, 0.2, 1);
		var lastPidOutput;

		for(var i = 0; i < 1000; i++) {
			lastPidOutput = pid.update();

			pidOutputs.push(lastPidOutput);
			if(pidOutputs.length === 5) {
				currentTemperature += (pidOutputs.shift() * 0.1);
			}
			console.log(lastPidOutput, currentTemperature);
		}

		expect(currentTemperature).to.be.lessThan(setPoint + 1);
		expect(currentTemperature).to.be.greaterThan(setPoint - 1);
	});
});
