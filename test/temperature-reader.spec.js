'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sensors = require('../src/mock/ds18b20');
const expect = chai.expect;
const TemperatureReader = require('../src/temperature-reader');
chai.use(sinonChai);

describe('TemperatureReader', () => {
	describe('start', () => {
		var mocks;
		var temperatureReader;

		beforeEach(() => {
			mocks = sinon.collection;
		});

		afterEach(() => {
			temperatureReader.stop();
			mocks.restore();
		});

		it('reads temperature from sensor', () => {
			const sensorId = 'testId';
			const degCelc = 100;
			const expectedDegFahr = 212;

			const mockSensors = mocks.stub(sensors, 'sensors', function(callback) {
				callback(undefined, [sensorId]);
			});

			const mockTemperatureSync = mocks.stub(sensors, 'temperature', function(id, callback) {
				expect(id).to.equal(sensorId);
				callback(undefined, degCelc);
			});

			temperatureReader = new TemperatureReader(sensors);
			temperatureReader.start();
			var result = temperatureReader.temperature(sensorId);

			expect(result).to.equal(expectedDegFahr);
		});
	});
});