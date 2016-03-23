var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import Immutable from 'immutable';

import itemReducers from '../../src/player/item/itemreducers';
var testContent = require('../data/content.test.json');

describe('ItemReducers', function () {

    describe('timestamp reducer', function () {

		beforeEach(function(){
		});

		afterEach(function(){

		});

		it('should register start time on empty state', function () {
            let action = {
                type: 'REGISTER_START'
            };
            let newState = itemReducers.timestamps(undefined, action).toJS();

            let expected = [
                {start: newState[0].start}
            ];
            expect(newState).to.deep.equal(expected);
		});

        it('should register start time with explict timestamp on empty state', function () {
            let action = {
                type: 'REGISTER_START',
                timestamp: new Date()
            };
            let newState = itemReducers.timestamps(undefined, action).toJS();
            let expected = [
                {start: action.timestamp}
            ];
            expect(newState).to.deep.equal(expected);
		});

        it('should register start time on existing state', function () {
            let action = {
                type: 'REGISTER_START',
                timestamp: new Date()
            };
            let entry = {start: new Date(), stop: new Date()};
            let state = Immutable.List.of(entry);
            let newState = itemReducers.timestamps(state, action).toJS();
            let expected = [
                entry,
                {start: action.timestamp}
            ];
            expect(newState).to.deep.equal(expected);
		});

        it('should register stop time on empty state', function () {
            let action = {
                type: 'REGISTER_STOP'
            };
            let newState = itemReducers.timestamps(undefined, action).toJS();
            let expected = [
                {start: newState[0].start, stop: newState[0].stop, elapsedSeconds: 0}
            ];
            expect(newState).to.deep.equal(expected);
		});

        it('should register stop time on existing state', function (done) {
            let action = {
                type: 'REGISTER_STOP'
            };
            let entry = {start: new Date(), stop: new Date()};

            setTimeout(function(){
                let state = Immutable.List.of(entry);
                let newState = itemReducers.timestamps(state, action).toJS();
                let actualElapsedSeconds = Math.round( (newState[0].stop.getTime() - newState[0].start.getTime()) / 1000 );
                //console.log('actualElapsedSeconds=' + actualElapsedSeconds);
                expect(actualElapsedSeconds >= 1, "Elapsed is not 1 sec.").to.be.true;
                let expected = [
                    {start: newState[0].start, stop: newState[0].stop, elapsedSeconds: actualElapsedSeconds}
                ];
                try {
                    expect(newState).to.deep.equal(expected);
                    done();
                } catch (error) {
                    done(error);
                }

            }, 600);

		});
	});
});
