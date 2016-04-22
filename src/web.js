'use strict';

const _ = require('lodash');
const koa = require('koa');
const Router = require('koa-router');

const defaults = Object.freeze({
	port: 80
});

var _app;
var _configuration;
var _getStatusFunction;
var _httpServer;

exports.init = function(configuration, getStatusFunction) {
	_configuration = _.extend({}, defaults, configuration);
	_app = koa();
	_getStatusFunction = getStatusFunction;
};

exports.start = function() {
	const router = new Router();
	router.get('/api/status', apiUpdateMiddleware);

	_app.use(require('koa-static')('src/ui'));
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
