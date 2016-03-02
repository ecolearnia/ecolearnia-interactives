var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/core/storefacade';


describe('StoreFacade', function () {

	before(function(){
	});

	function testReducer (state = {}, action) {
		switch(action.type) {
			case 'test':
				state['data'] = action.data;
			default:
				return state;
		}
	}
    describe('Initialize', function () {
        let store = new StoreFacade(testReducer);

		it('should initialize', function () {
			expect(store.store_).to.not.null;
		});

	});

	describe('dispatch', function () {
		let store = new StoreFacade(testReducer);
		it('should dispatch', function () {
			var result = store.dispatch({type: 'test', data:'test-data'});
			var state = store.getState();
			expect(result).to.deep.equals({type: 'test', data:'test-data'});
			console.log('State:' + JSON.stringify(state));
			expect(state, 'Invalid state!').to.deep.equals({data:'test-data'});
		});
	});

	describe('reset', function () {
		let store = new StoreFacade(testReducer);
		it('should reset', function () {
			var result = store.dispatch({type: 'test', data:'test-data'});
			var state = store.getState();
			expect(state).to.deep.equals({data:'test-data'});
			store.reset();
			state = store.getState();
			expect(state).to.deep.equals({});
		});
	});

});
