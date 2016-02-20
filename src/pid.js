'use strict';

const INTEGRAL_SUM_MIN = -10;
const INTEGRAL_SUM_MAX = 10;

module.exports = class {
	constructor(setPoint, tempSensorId, proportionalGain, integralGain, differentialGain, temperatureReader) {
		this._tempSensorId = tempSensorId;
		this._proportionalGain = proportionalGain;
		this._integralGain = integralGain;
		this._differentialGain = differentialGain;
		this._integratorSum = 0;
		this._differentialPrevious = undefined;
		this._temperatureReader = temperatureReader;
		this.setPoint = setPoint;
	}

	update() {
		var position = this._temperatureReader.temperature(this._tempSensorId);
		var error = this.setPoint - position;

		var proportioonalComponent = this._proportional(error);
		var integralComponent = this._integral(error);
		var differentialComponent = this._differential(position);

		this.value = proportioonalComponent + integralComponent + differentialComponent;
		return this.value;
	}

	_proportional(error) {
		return this._proportionalGain * error;
	}

	_integral(error) {
		this._integratorSum += error;

		if(this._integratorSum > INTEGRAL_SUM_MAX) {
			this._integratorSum = INTEGRAL_SUM_MAX;
		} else if(this._integratorSum < INTEGRAL_SUM_MIN) {
			this._integratorSum = INTEGRAL_SUM_MIN;
		}

		return this._integralGain * this._integratorSum;
	}

	_differential(position) {
		var differentialComponent;

		if(this._differentialPrevious === undefined) {
			this._differentialPrevious = position;
		}

		differentialComponent = this._differentialGain * (position - this._differentialPrevious);

		this._differentialPrevious = position;
		return differentialComponent;
	}
};