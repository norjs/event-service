// Interfaces
require('@norjs/event/types');

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
 * @type {typeof HttpRequestController}
 */
const HttpRequestController = require('../abstracts/HttpRequestController.js');

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
class EventServiceHttpRequestController extends HttpRequestController {

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
		console.log(`Request "${this._request.method} ${this._request.url}" started`);

		const url = this._request.url;

		if (url.startsWith(ROUTES.fetchEvents)) {
			console.log('fetchEvents: ', url);
			return this._jsonResponse(
				(params, payload) => this._onFetchEventsRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.trigger)) {
			console.log('Trigger: ', url);
			return this._jsonResponse(
				(params, payload) => this._onTriggerRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.start)) {
			console.log('start: ', url);
			return this._jsonResponse(
				(params, payload) => this._onStartRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.stop)) {
			console.log('stop: ', url);
			return this._jsonResponse(
				(params, payload) => this._onStopRequest(params, payload)
			);
		}

		if (url.startsWith(ROUTES.setEvents)) {
			console.log('setEvents: ', url);
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
	 * @protected
	 */
	_onTriggerRequest (params, payload) {

		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "TriggerEventServiceRequestDTO");

		console.log('Trigger: ', params, payload);

		/**
		 *
		 * @type {Array.<Event>}
		 */
		const events = [];

		return this._controller.trigger(events);
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {{}}
	 * @protected
	 */
	_onStartRequest (params, payload) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "{}");

		console.log('Start: ', this._request.url);
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {{}}
	 * @protected
	 */
	_onStopRequest (params, payload) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "{}");

		console.log('Stop: ', this._request.url);
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {{}}
	 * @protected
	 */
	_onSetEventsRequest (params, payload) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "{}");

		console.log('setEvents: ', this._request.url);
	}

	/**
	 *
	 * @param params {{}}
	 * @param payload {{}}
	 * @protected
	 */
	_onFetchEventsRequest (params, payload) {
		TypeUtils.assert(params, "{}");
		TypeUtils.assert(payload, "{}");

		console.log('fetchEvents: ', this._request.url);
	}

}

TypeUtils.defineType("EventServiceHttpRequestController", TypeUtils.classToTestType(EventServiceHttpRequestController));

/**
 *
 * @type {typeof EventServiceHttpRequestController}
 */
module.exports = EventServiceHttpRequestController;
