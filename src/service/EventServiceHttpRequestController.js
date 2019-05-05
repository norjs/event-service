// Interfaces
require('@norjs/event/types');

const _ = require('lodash');

/**
 *
 * @type {typeof LogicUtils}
 */
const LogicUtils = require('@norjs/utils/Logic');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 *
 * @type {typeof Event}
 */
const Event = require("@norjs/event/Event");

/**
 *
 * @type {typeof AbstractSocketHttpServer}
 */
const AbstractSocketHttpServer = require('@norjs/socket-service/src/abstracts/AbstractSocketHttpServer.js');

/**
 *
 * @type {typeof AbstractHttpRequestController}
 */
const AbstractHttpRequestController = require('@norjs/socket-service/src/abstracts/AbstractHttpRequestController.js');

/**
 *
 * @type {{stop: string, fetchEvents: string, start: string, trigger: string, setEvents: string}}
 */
const ROUTES = {
	trigger: '/trigger',
	start: '/start',
	stop: '/stop',
	fetchEvents: '/fetchEvents',
	setEvents: '/setEvents'
};

/**
 * This class implements HTTP application server for nor-event-service.
 */
class EventServiceHttpRequestController extends AbstractHttpRequestController {

	/**
	 *
	 * @param request {HttpRequestObject}
	 * @param response {HttpResponseObject}
	 * @param controller {EventServiceController}
	 */
	constructor ({
		request,
		response,
		controller
	} = {}) {

		super({request, response});

		TypeUtils.assert(controller, "EventServiceController");

		/**
		 *
		 * @member {EventServiceController}
		 * @private
		 */
		this._controller = controller;

	}

	/**
	 *
	 * @returns {*}
	 * @protected
	 */
	onRequest () {
		console.log(`[${AbstractSocketHttpServer.getTimeForLog()}] Request "${this._request.method} ${this._request.url}" started`);

		const url = this._request.url;

		if (url.startsWith(ROUTES.fetchEvents)) {
			//console.log('onRequest: fetchEvents: ', url);
			// noinspection JSCheckFunctionSignatures
			return this._jsonResponse(
				(params) => this._onFetchEventsRequest(params)
			);
		}

		if (url.startsWith(ROUTES.trigger)) {
			//console.log('onRequest: Trigger: ', url);
			return this._jsonResponse(
				(params, payload) => this._onTriggerRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.start)) {
			//console.log('onRequest: start: ', url);
			// noinspection JSCheckFunctionSignatures
			return this._jsonResponse(
				(params, payload) => this._onStartRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.stop)) {
			//console.log('onRequest: stop: ', url);
			// noinspection JSCheckFunctionSignatures
			return this._jsonResponse(
				(params) => this._onStopRequest(params)
			);
		}

		if (url.startsWith(ROUTES.setEvents)) {
			//console.log('onRequest: setEvents: ', url);
			// noinspection JSCheckFunctionSignatures
			return this._jsonResponse(
				(params, payload) => this._onSetEventsRequest(params, payload)
			);
		}

		return super.onRequest();
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {TriggerEventServiceRequestDTO}
	 * @returns {TriggerEventServiceResponseDTO}
	 * @protected
	 */
	_onTriggerRequest (params, payload) {

		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "TriggerEventServiceRequestDTO");

		//console.log('_onTriggerRequest: params: ', params);
		//console.log('_onTriggerRequest: payload: ', payload);

		/**
		 *
		 * @type {Array.<Event>}
		 */
		const events = _.map(payload.events || [], event => new Event(event));

		//console.log('_onTriggerRequest: events: ', events);

		return this._controller.trigger(events);
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {StartEventServiceRequestDTO}
	 * @returns {StartEventServiceResponseDTO}
	 * @protected
	 */
	_onStartRequest (params, payload) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "{}");

		//console.log('Start: ', this._request.url);

		return this._controller.start(payload.events);
	}

	/**
	 *
	 * @param params {{fetchId: string}}
	 * @returns {StopEventServiceResponseDTO}
	 * @protected
	 */
	_onStopRequest (params) {
		TypeUtils.assert(params, "{fetchId: string}");
		TypeUtils.assert(params.fetchId, "string");

		//console.log('Stop: ', this._request.url);

		return this._controller.stop(params.fetchId);
	}

	/**
	 *
	 * @param params {{fetchId: string}}
	 * @param payload {SetEventsServiceRequestDTO}
	 * @returns {SetEventsServiceResponseDTO}
	 * @protected
	 */
	_onSetEventsRequest (params, payload) {
		TypeUtils.assert(params, "{fetchId: string}");
		TypeUtils.assert(params.fetchId, "string");
		TypeUtils.assert(payload, "SetEventsServiceRequestDTO");

		// console.log('setEvents: ', this._request.url);

		return this._controller.setEvents(params.fetchId, payload.events);
	}

	/**
	 *
	 * @param params {{fetchId: string}}
	 * @returns {Promise.<FetchEventServiceResponseDTO>}
	 * @protected
	 */
	_onFetchEventsRequest (params) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(params.fetchId, "string");

		//console.log('fetchEvents: ', this._request.url);

		return this._controller.fetchEvents(params.fetchId);
	}

}

TypeUtils.defineType("EventServiceHttpRequestController", TypeUtils.classToTestType(EventServiceHttpRequestController));

/**
 *
 * @type {typeof EventServiceHttpRequestController}
 */
module.exports = EventServiceHttpRequestController;
