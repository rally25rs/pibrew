'use strict';

var _gpioToWiringPi = {
	17: 11,
	18: 12,
	//21: 2, // or 27 on a rev2 board
	22: 15,
	23: 16,
	24: 5,
	25: 6,
	4: 7,
	//0: 8, // 2 on a rev2 board
	//1: 9, // 3 on a rev2 board
	8: 10,
	7: 11,
	10: 12,
	9: 13,
	11: 14,
	14: 15,
	15: 16,
	28: 17,
        27: 13,
	29: 18,
	30: 19,
	31: 20
};

exports.gpioToWiringPi = function(gpioPin) {
	if(_gpioToWiringPi.hasOwnProperty(gpioPin)) {
		return _gpioToWiringPi[gpioPin];
	}
};
