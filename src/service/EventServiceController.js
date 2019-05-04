// Interfaces
require('@norjs/event/types');

const _ = require('lodash');

/**
 *
 * @type {number}
 */
const FETCH_TIMEOUT = 5000;

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
 * @typedef {object} EventServiceSessionObject
 * @property {string} fetchId - The ID for the session
 * @property {Array.<string>} events - Event names which this session wants to get
 * @property {Array.<Event>} queue - Event's in queue to be fetched
 * @property {Timeout} [timer] - Current NodeJS timeout object, if a fetch request is active
 * @property {Function} [timerFn] - Current timer callback function
 */
TypeUtils.defineType("EventServiceSessionObject", {
	"fetchId": "string",
	"events": "Array.<string>",
	"queue": "Array.<Event>",
	"timer": "Object|undefined",
	"timerFn": "function|undefined"
});

/**
 * This class implements NorJS event service business logic.
 */
class EventServiceController {

	/**
	 *
	 * @param idGenerator {function: string} A function to use to generate IDs
	 */
	constructor (idGenerator) {

		/**
		 *
		 * @member {Object.<string, EventServiceSessionObject>}
		 * @private
		 */
		this._sessions = {};

		/**
		 * A function which generates session IDs.
		 *
		 * @member {function(): string}
		 * @private
		 */
		this._idGenerator = idGenerator;

	}

	/**
	 * Trigger event(s) at upstream.
	 *
	 * Resolves successfully if the EventService has successfully taken responsibility of the event,
	 * otherwise rejects the promise.
	 *
	 * @param events {Array.<Event>}
	 * @returns {TriggerEventServiceResponse}
	 */
	trigger (events) {
		TypeUtils.assert(events, "Array.<Event>");
		console.log('WOOT: events: ', TypeUtils.stringify(events));

		_.forEach(events, event => {
			if (!event.name) throw new TypeError("Events must have a name");
		});

		_.forEach(this._sessions,
			/**
			 *
			 * @param session {EventServiceSessionObject}
			 */
			session => {

				let newEvents = false;

				_.forEach(events,
					/**
					 *
					 * @param event {Event}
					 */
					event => {
						if (session.events.indexOf(event.name) >= 0) {
							session.queue.push(event);
							newEvents = true;
						}
					}
				);

				if (newEvents && session.timer) {
					this._triggerSessionTimer(session);
				}

			}
		);

		return {
			events
		};
	}

	/**
	 * (Re)Set events which the upstream should return to us.
	 *
	 * @param fetchId {string} Fetch ID you got from .start()
	 * @param events {Array.<string>}
	 * @returns {SetEventsServiceResponseDTO}
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

		const session = this._getSession(fetchId);

		return new Promise( (resolve, reject) => LogicUtils.tryCatch(
			() => {

				if (session.timer) {
					throw new Error(`Another fetch was already active for "${fetchId}"`);
				}

				const events = this._fetchEventsFromSession(fetchId);
				if (!events.length) {

					const timerFn = () => {

						LogicUtils.tryCatch(
							() => {
								const events = this._fetchEventsFromSession(fetchId);
								resolve({
									fetchId,
									events
								});
							},
							err => reject(err),
						);

						if (session.timerFn) {
							delete session.timerFn;
						}
						if (session.timer) {
							delete session.timer;
						}
					};

					session.timerFn = timerFn;

					session.timer = setTimeout(
						timerFn,
						FETCH_TIMEOUT
					);

				} else {
					resolve({
						fetchId,
						events
					});
				}
			},
			err => reject(err)
		));

	}

	/**
	 * Start to listen event names which the upstream should relay to us.
	 *
	 * @param events {Array.<string>}
	 * @returns {StartEventServiceResponseDTO} Promise of a response
	 */
	start (events) {
		TypeUtils.assert(events, "Array.<string>");
		console.log('events: ', events);

		/**
		 *
		 * @type {string}
		 */
		const fetchId = this._idGenerator();

		if (_.has(this._sessions, fetchId)) {
			throw new TypeError(`Session ID was not unique? Already in use: ${fetchId}`);
		}

		/**
		 *
		 * @type {EventServiceSessionObject}
		 */
		const session = {
			fetchId,
			events,
			queue: []
		};

		this._sessions[fetchId] = session;

		return {
			fetchId,
			events
		};
	}

	/**
	 * Stop listening events on this fetch ID, and remove this fetch ID.
	 *
	 * @param fetchId {string} Fetch ID you got from .start()
	 * @returns {StopEventServiceResponse}
	 */
	stop (fetchId) {
		TypeUtils.assert(fetchId, "string");
		console.log('fetchId: ', fetchId);

		const session = this._getSession(fetchId);

		if (session.timer) {
			this._triggerSessionTimer(session);
		}

		this._deleteSession(session);

		return {
			fetchId,
			events: session.queue
		};
	}

	/**
	 *
	 * @param fetchId {string}
	 * @returns {boolean}
	 * @private
	 */
	_hasSession (fetchId) {
		return _.has(this._sessions, fetchId);
	}

	/**
	 *
	 * @param fetchId {string}
	 * @returns {EventServiceSessionObject}
	 * @private
	 */
	_getSession (fetchId) {
		return _.has(this._sessions, fetchId) ? this._sessions[fetchId] : undefined;
	}

	/**
	 *
	 * @param session {EventServiceSessionObject}
	 * @returns {EventServiceSessionObject} The removed object
	 * @private
	 */
	_deleteSession (session) {
		const fetchId = session.fetchId;
		if (this._hasSession(fetchId)) {
			delete this._sessions[fetchId];
		}
		return session;
	}

	/**
	 *
	 * @param fetchId {string}
	 * @param limit {number}
	 * @return {Array}
	 * @private
	 */
	_fetchEventsFromSession (fetchId, limit=100) {
		const session = this._getSession(fetchId);
		const events = [];
		while (session.queue.length && events.length <= limit) {
			events.push( session.queue.shift() );
		}
		return events;
	}

	/**
	 *
	 * @param session {EventServiceSessionObject}
	 * @private
	 */
	_triggerSessionTimer (session) {
		if (session.timer) {
			clearTimeout(session.timer);
			const timerFn = session.timerFn;
			delete session.timerFn;
			delete session.timer;
			timerFn();
		}
	}

}

TypeUtils.defineType("EventServiceController", TypeUtils.classToTestType(EventServiceController));

TypeUtils.assert(EventServiceController, "EventService");

/**
 *
 * @type {typeof EventServiceController}
 */
module.exports = EventServiceController;
