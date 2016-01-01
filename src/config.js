'use strict';

var minimist = require('minimist');
var _ = require('lodash');
var configFile = require('../config.json');

var defaults = {
	env: 'prod',
	poll: 333,
	sensors: {}
};

module.exports = _.extend(defaults, configFile, minimist(process.argv.slice(2)));

console.log('Using Configuration:');
console.log('--------------------');
console.dir(module.exports);
console.log('--------------------');
