'use strict';

const _ = require('lodash');
const koa = require('koa');
const Router = require('koa-router');
const socketIo = require('socket.io');
var bodyParser = require('koa-bodyparser');

const defaults = Object.freeze({
	port: 80
});

var _app;
var _configuration;
var _getStatusFunction;
var _httpServer;
var _updateDeviceModeFunction;
var _updateDeviceSetpointFunction;
var _io;

function onSocketConnection(socket) {
	socket.on('setSetpoint', apiSetSetpointRequest);
	socket.on('setMode', apiSetModeRequest);
	socket.emit('update', JSON.stringify(_getStatusFunction()));
}

exports.init = function(configuration, getStatusFunction, updateDeviceModeFunction, updateDeviceSetpointFunction) {
	_configuration = _.extend({}, defaults, configuration);
	_app = koa();
	_getStatusFunction = getStatusFunction;
	_updateDeviceModeFunction = updateDeviceModeFunction;
	_updateDeviceSetpointFunction = updateDeviceSetpointFunction;
};

exports.start = function() {
	_app.use(require('koa-static')('src/ui'));
	_app.use(bodyParser());
	_httpServer = _app.listen(_configuration.port);
	_httpServer.setTimeout(2000);
	_io = socketIo(_httpServer);

	_io.on('connection', onSocketConnection);
};

exports.stop = function() {
	_httpServer.close();
};

exports.emitUpdate = function() {
	_io.emit('update', JSON.stringify(_getStatusFunction()));
};

function apiSetModeRequest(req) {
	const {deviceIndex, mode} = JSON.parse(req);

	_updateDeviceModeFunction(deviceIndex, mode);
	exports.emitUpdate();
}

function apiSetSetpointRequest(req) {
	const {deviceIndex, setPoint} = JSON.parse(req);

	_updateDeviceSetpointFunction(deviceIndex, setPoint);
	exports.emitUpdate();
}