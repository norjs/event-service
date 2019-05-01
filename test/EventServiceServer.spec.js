const assert = require('assert');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require('@norjs/utils/Type');
TypeUtils.setDefineDefaultsJustInTime(false);

/**
 *
 * @type {typeof EventServiceServer}
 */
const EventServiceServer = require('../src/EventServiceServer.js');

describe('EventServiceServer', () => {

    describe('#getAppName', () => {
        it('returns the name', () => {
            assert( EventServiceServer.getAppName(), "nor-event-service" );
        });
    });

    describe('instance', () => {

        let server;

        beforeEach( () => {
            server = new EventServiceServer();
        });

        afterEach( () => {
            server = undefined;
        });

        describe('start request', () => {

        });

        describe('stop request', () => {

        });

        describe('trigger request', () => {

        });

        describe('setEvents request', () => {

        });

        describe('fetchEvents request', () => {

        });

        describe('#close', () => {



        });

    });


});
