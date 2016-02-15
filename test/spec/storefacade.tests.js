var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/core/storefacade';


describe('StoreFacade', function () {

	before(function(){
	});

	function testReducer (state = {}, action) {
		return state;
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
			expect(result).to.deep.equals({type: 'test', data:'test-data'});
		});
	});

});
