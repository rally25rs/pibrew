'use strict';

const minimist = require('minimist');
const _ = require('lodash');
const configFile = require('../config.json');

const defaults = {
	env: 'prod',
	poll: 333,
	devices: []
};

module.exports = _.extend(defaults, configFile, minimist(process.argv.slice(2)));

console.log('Using Configuration:');
console.log('--------------------');
console.dir(module.exports);
console.log('--------------------');
