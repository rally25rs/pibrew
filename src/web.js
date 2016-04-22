'use strict';

const _ = require('lodash');
const koa = require('koa');
const Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

const defaults = Object.freeze({
	port: 80
});

var _app;
var _configuration;
var _getStatusFunction;
var _httpServer;
var _updateDeviceModeFunction;

exports.init = function(configuration, getStatusFunction, updateDeviceModeFunction) {
	_configuration = _.extend({}, defaults, configuration);
	_app = koa();
	_getStatusFunction = getStatusFunction;
	_updateDeviceModeFunction = updateDeviceModeFunction;
};

exports.start = function() {
	const router = new Router();
	router.get('/api/status', apiUpdateMiddleware);
	router.put('/api/mode', apiSetModeMiddleware);

	_app.use(require('koa-static')('src/ui'));
	_app.use(bodyParser());
	_app.use(router.middleware());
	_httpServer = _app.listen(_configuration.port);
	_httpServer.setTimeout(2000);
};

exports.stop = function() {
	_httpServer.close();
};

function *apiUpdateMiddleware(next) {
	yield next;
	this.response.body = JSON.stringify(_getStatusFunction());
}

function *apiSetModeMiddleware(next) {
	console.log(this.request);
	const deviceIndex = this.request.body.deviceIndex;
	const mode = this.request.body.mode;

	yield next;

	_updateDeviceModeFunction(deviceIndex, mode);
	this.response.body = JSON.stringify(_getStatusFunction());
}