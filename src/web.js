'use strict';

const _ = require('lodash');
const koa = require('koa');
const Router = require('koa-router');

const defaults = Object.freeze({
	port: 80
});

module.exports = class {
	constructor(configuration) {
		this._configuration = _.extend({}, defaults, configuration);
		this.app = koa();
	}

	start() {
		const router = new Router();
		router.get('/api/update', this.apiUpdateMiddleware);

		this.app.use(require('koa-static')('src/ui'));
		this.app.use(router.middleware());
		this.httpServer = this.app.listen(this._configuration.port);
		this.httpServer.setTimeout(2000);
	}

	stop() {
		this.httpServer.close();
	}

	*apiUpdateMiddleware(next) {
		yield next;
		this.response.body = JSON.stringify([{
			name: 'Bob'
		}]);
	}
};
