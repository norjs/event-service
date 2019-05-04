require('@norjs/event/types');

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

/**
 * This class implements NorJS event service business logic.
 *
 * @implements {EventService}
 */
class EventServiceController {

	/**
	 *
	 */
	constructor () {

	}

	/**
	 * Trigger event(s) at upstream.
	 *
	 * Resolves successfully if the EventService has successfully taken responsibility of the event,
	 * otherwise rejects the promise.
	 *
	 * @param events {Array.<Event>}
	 * @returns {Promise.<TriggerEventServiceResponse>}
	 */
	trigger (events) {
		TypeUtils.assert(events, "Array.<Event>");
		console.log('WOOT: events: ', TypeUtils.toString(events));
	}

	/**
	 * (Re)Set events which the upstream should return to us.
	 *
	 * @param fetchId {string} Fetch ID you got from .start()
	 * @param events {Array.<string>}
	 * @returns {Promise.<SetEventsServiceResponseDTO>}
	 */
	setEvents (fetchId, events) {
		TypeUtils.assert(fetchId, "string");
		TypeUtils.assert(events, "Array.<string>");
		console.log('fetchId: ', fetchId);
		console.log('events: ', events);
	}

	/**
	 * Long poll for an array of events.
	 *
	 * @param fetchId {string} Fetch ID you got from .start()
	 * @returns {Promise.<FetchEventServiceResponse>} Array of received events, otherwise empty array.
	 */
	fetchEvents (fetchId) {
		TypeUtils.assert(fetchId, "string");
		console.log('fetchId: ', fetchId);
	}

	/**
	 * Start to listen event names which the upstream should relay to us.
	 *
	 * @param events {Array.<string>}
	 * @returns {Promise.<StartEventServiceResponseDTO>} Promise of a response
	 */
	start (events) {
		TypeUtils.assert(events, "Array.<string>");
		console.log('events: ', events);
	}

	/**
	 * Stop listening events on this fetch ID, and remove this fetch ID.
	 *
	 * @param fetchId {string} Fetch ID you got from .start()
	 * @returns {Promise.<StopEventServiceResponseDTO>}
	 */
	stop (fetchId) {
		TypeUtils.assert(fetchId, "string");
		console.log('fetchId: ', fetchId);
	}

}

TypeUtils.defineType("EventServiceController", TypeUtils.classToTestType(EventServiceController));

TypeUtils.assert(EventServiceController, "EventService");

/**
 *
 * @type {typeof EventServiceController}
 */
module.exports = EventServiceController;
