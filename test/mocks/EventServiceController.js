/**
 */
class EventServiceControllerMock {

    /**
     * Trigger event(s) at upstream.
     *
     * Resolves successfully if the EventService has successfully taken responsibility of the event,
     * otherwise rejects the promise.
     *
     * @param events {Array.<Event>}
     * @returns {Promise.<TriggerEventServiceResponse>}
     */
    trigger (events) {}

    /**
     * (Re)Set events which the upstream should return to us.
     *
     * @param fetchId {string} Fetch ID you got from .start()
     * @param events {Array.<string>}
     * @returns {Promise.<SetEventsServiceResponseDTO>}
     */
    setEvents (fetchId, events) {}

    /**
     * Long poll for an array of events.
     *
     * @param fetchId {string} Fetch ID you got from .start()
     * @returns {Promise.<FetchEventServiceResponse>} Array of received events, otherwise empty array.
     */
    fetchEvents (fetchId) {}

    /**
     * Start to listen event names which the upstream should relay to us.
     *
     * @param events {Array.<string>}
     * @returns {Promise.<StartEventServiceResponseDTO>} Promise of a response
     */
    start (events) {}

    /**
     * Stop listening events on this fetch ID, and remove this fetch ID.
     *
     * @param fetchId {string} Fetch ID you got from .start()
     * @returns {Promise.<StopEventServiceResponseDTO>}
     */
    stop (fetchId) {}

}

/**
 *
 * @type {EventServiceControllerMock}
 */
module.exports = EventServiceControllerMock;
