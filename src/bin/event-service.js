#!/usr/bin/node
// nor-event-service

/**
 *
 * @type {PathModule}
 */
const PATH = require('path');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 *
 * @type {typeof LogicUtils}
 */
const LogicUtils = require('@norjs/utils/Logic');

LogicUtils.tryCatch( () => {

	/**
	 *
	 * @type {HttpServerModule}
	 */
	const HTTP = require('http');

	/**
	 *
	 * @type {FileSystemModule}
	 */
	const FS = require('fs');

	/**
	 *
 	 * @type {v4}
	 */
	const UUID = require('uuid');

	/**
	 *
	 * @type {string}
	 */
	const NODE_LISTEN = process.env.NODE_LISTEN || `${__dirname}/nor-event-service.socket`;

	loadTypes(process.env.NOR_EVENT_LOAD_TYPES);

	/**
	 *
	 * @type {Object.<string, string>}
	 */
	const NOR_EVENT_PAYLOAD_TYPES = parsePayloadTypes(process.env.NOR_EVENT_PAYLOAD_TYPES);

	/**
	 *
	 * @type {typeof EventServiceController}
	 */
	const EventServiceController = require('../service/EventServiceController.js');
	// TypeUtils.assert(EventServiceController, "typeof EventServiceController");

	/**
	 *
	 * @type {typeof EventServiceHttpRequestController}
	 */
	const EventServiceHttpRequestController = require('../service/EventServiceHttpRequestController.js');
	// TypeUtils.assert(EventServiceHttpRequestController, "typeof EventServiceHttpRequestController");

	/**
	 *
	 * @type {typeof EventServiceSocketHttpServer}
	 */
	const EventServiceSocketHttpServer = require('../service/EventServiceSocketHttpServer.js');
	// TypeUtils.assert(EventServiceSocketHttpServer, "typeof EventServiceSocketHttpServer");

	// const args = process.argv.slice(2);
	// const TRY_RUN = args.some(arg => arg === TRY_RUN_ARG);

	/**
	 *
	 * @type {EventServiceSocketHttpServer}
	 */
	const server = new EventServiceSocketHttpServer({
		listen: NODE_LISTEN,
		httpModule: HTTP,
		fsModule: FS,
		pathModule: PATH,
		controller: new EventServiceController({
			idGenerator: () => UUID(),
			payloadTypes: NOR_EVENT_PAYLOAD_TYPES
		}),
		RequestController: EventServiceHttpRequestController
	});

	server.start();

	const closeServer = () => LogicUtils.tryCatch(
		() => server.close(),
		err => {
			console.error('Exception: ' + err)
		}
	);

	process.on('exit', closeServer);
	process.on('SIGTERM', closeServer);
	process.on('SIGINT', closeServer);
	process.on('SIGUSR1', closeServer);
	process.on('SIGUSR2', closeServer);
	process.on('uncaughtException', closeServer);

}, err => {
	console.error('Exception: ' + err);

	if (err.stack) {
		console.error(err.stack);
	}

	process.exit(1);
});

/**
 *
 * @param value {string}
 * @returns {Object.<string, string>}
 */
function parsePayloadTypes (value) {

	if (!value) return {};

	// Directly JSON
	if (value[0] === '{') {
		const types = JSON.parse(value);
		TypeUtils.assert(types, "Object.<string,string>");
		return types;
	}

	// Filename
	const types = requireFile(value);
	TypeUtils.assert(types, "Object.<string,string>");
	return types;
}

/**
 *
 * @param value {string}
 */
function loadTypes (value) {
	if (value) requireFile(value);
}

/**
 *
 * @param name {string}
 * @return {any}
 */
function requireFile (name) {
	return require(PATH.resolve(process.cwd(), name));
}
