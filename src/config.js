'use strict';

var minimist = require('minimist');
var _ = require('lodash');

var defaults = {
	env: 'prod'
};

module.exports = _.extend(defaults, minimist(process.argv.slice(2)));
