require('../interfaces/HttpRequestObject.js');
require('../interfaces/HttpResponseObject.js');

/**
 *
 * @type {typeof LogicUtils}
 */
const LogicUtils = require('@norjs/utils/Logic');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require('@norjs/utils/Type');

const PATH = require('path');
const FS = require('fs');

/**
 * This class implements a HTTP server over UNIX socket file.
 *
 * @abstract
 */
class SocketHttpServer {

	/**
	 *
	 * @param listen {string} The UNIX socket file to listen for requests.
	 * @param http {HttpServerModule} The Node.js HTTP module
	 */
	constructor ({listen, http} = {}) {

		TypeUtils.assert(listen, "string");
		TypeUtils.assert(http, "HttpServerModule");

		/**
		 *
		 * @member {string}
		 * @protected
		 */
		this._listen = listen;

		/**
		 *
		 * @member {boolean}
		 * @protected
		 */
		this._running = false;

		/**
		 *
		 * @member {HttpServerModule}
		 * @protected
		 */
		this._http = http;

		/**
		 *
		 * @member {HttpServerObject}
		 * @protected
		 */
		this._server = undefined;

		/**
		 *
		 * @member {string}
		 * @protected
		 */
		this._socketFile = undefined;

		/**
		 *
		 * @member {typeof SocketHttpServer}
		 * @protected
		 */
		this.Class = this.getClass();

	}

	/**
	 *
	 * @returns {typeof SocketHttpServer}
	 */
	getClass () {
		return this.constructor;
	}

	/**
	 *
	 * @returns {string}
	 */
	static getTimeForLog () {
		return (new Date()).toISOString();
	}

	/**
	 *
	 * @returns {string}
	 * @abstract
	 */
	static getAppName () {
		return 'unnamed-service';
	}

	/**
	 * @protected
	 */
	_onStart () {
	}

	/**
	 * Returns a request controller for this request.
	 *
	 * @param request {HttpRequestObject}
	 * @param response {HttpResponseObject}
	 * @returns {HttpRequestController}
	 * @abstract
	 */
	createRequestController (request, response) {}

	/**
	 *
	 * @param requestController {HttpRequestController}
	 * @protected
	 */
	_onRequest (requestController) {
		TypeUtils.assert(requestController, "HttpRequestController");
		const result = requestController.onRequest();
		if (TypeUtils.isPromise(result)) {
			result.catch(err => requestController.handleRequestErrors(err));
		}
	}

	/**
	 *
	 * @param request {HttpRequestObject}
	 * @param response {HttpResponseObject}
	 * @protected
	 */
	_handleRequest (request, response) {
		TypeUtils.assert(request, "HttpRequestObject");
		TypeUtils.assert(response, "HttpResponseObject");
		const requestController = this.createRequestController(request, response);
		LogicUtils.tryCatch(
			() => this._onRequest(requestController),
			err => requestController.handleRequestErrors(err)
		);
	}

	/**
	 * Start the service
	 */
	start () {

		TypeUtils.assert(this._server, "undefined");

		const server = this._http.createServer(
			(req, res) => LogicUtils.tryCatch(
				() => this._handleRequest(req, res),
				err => this._handleErrors(err)
			)
		);

		TypeUtils.assert(server, "HttpServerObject");

		this._server = server;

		/**
		 *
		 * @type {string}
		 */
		const socketFile = this._listen;

		const socketDir = PATH.dirname(socketFile);

		TypeUtils.assert(socketDir, "string");

		if (!FS.existsSync(socketDir)) {
			console.log(`[${this.getClass().getTimeForLog()}] Creating missing runtime directory at "${socketDir}"`);
			FS.mkdirSync(socketDir, {
				  recursive: true,
				  mode: '700'
			});
		}

		if (FS.existsSync(socketFile)) {
			const stats = FS.statSync(socketFile);
			if (stats.isSocket()) {
				console.log(`[${this.getClass().getTimeForLog()}] Old socket file detected at "${socketFile}"; unlinking it.`);
				FS.unlinkSync(socketFile);
			} else {
				throw new Error(`Socket file already exists and is not a socket: "${socketFile}"`);
			}
		}

		server.listen(socketFile, () => {

			this._socketFile = socketFile;
			this._running = true;

			FS.chmodSync(socketFile, '750');

			console.log(`[${this.getClass().getTimeForLog()}] ${this.getClass().getAppName()} running at ${socketFile}`);

			LogicUtils.tryCatch(
				() => {
					const result = this._onStart();
					if (result && result.catch) {
						result.catch(err => this._handleErrors(err));
					}
				},
				err => this._handleErrors(err)
			);
		});
	}

	/**
	 * Close the service
	 */
	close () {

		if (this._server) {
			this._server.close();
			this._server = undefined;
		}

		if (this._running) {
			this._running = false;
			if (this._socketFile) {
				console.log(`[${this.getClass().getTimeForLog()}] ${this.getClass().getAppName()} stopped at ${this._socketFile}`);
				if (FS.existsSync(this._socketFile)) {
					FS.unlinkSync(this._socketFile);
					console.log(`[${this.getClass().getTimeForLog()}] Removing socket file at ${this._socketFile}`);
				}
				this._socketFile = undefined;
			} else {
				console.log(`[${this.getClass().getTimeForLog()}] ${this.getClass().getAppName()} stopped at unknown location`);
			}
		}
	}

	/**
	 *
	 * @param err {Error}
	 * @return {*}
	 * @protected
	 */
	_handleErrors (err) {
		console.error(`[${this.Class.getTimeForLog()}] Error: `, err);
	}

}

TypeUtils.defineType("SocketHttpServer", TypeUtils.classToTestType(SocketHttpServer));

/**
 *
 * @type {typeof SocketHttpServer}
 */
module.exports = SocketHttpServer;
