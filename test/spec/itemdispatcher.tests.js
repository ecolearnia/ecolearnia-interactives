var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/core/storefacade';
import ItemDispatcher from '../../src/core/itemdispatcher';
import ItemActionFactory from '../../src/core/itemactionfactory';
import itemReducers from '../../src/core/itemreducers';
import Immutable from 'immutable';

describe('ItemDispatcher', function () {

    describe('Item action methods', function () {

		let store = null;
		let mockEvaluator = {
			evaluate: (itemId, itemState) =>
			{
				//console.log(itemId, itemState);
				// for the
				return Promise.resolve({descr: 'test eval result', itemId, itemState});
			}
		};

		beforeEach(function(){
	        store = new StoreFacade(itemReducers);
		});

		afterEach(function(){
			store.dispose();
		});

		it('should updateState', function () {
			let dispatcher = new ItemDispatcher({
				actionFactory: new ItemActionFactory(mockEvaluator)
			});
            dispatcher.setStore(store);

			var result = dispatcher.updateState('id1', {answer:123});

			const expectedStateItems = {
					"id1":{"answer":123}
			};
			//console.log('state/updateState=' + JSON.stringify(store.getState()));
			expect(result).to.deep.equals({"type":"ITEM_UPDATE_STATE","componentId":"id1","state":{"answer":123}});

			// getState().items is of type Immutable
			expect(store.getState().components.toObject()).to.deep.equals(expectedStateItems);
		});

		it('should evaluate', function (done) {
			let dispatcher = new ItemDispatcher({
				actionFactory: new ItemActionFactory(mockEvaluator)
			});
            dispatcher.setStore(store);

			store.getState().components = Immutable.Map({
				id1 : { mystate: 123 }
			});
			const expectedEvalResults = {
				"id1":{
					"descr":"test eval result","itemId":"id1","itemState":{"mystate":123}
				}
			};

			dispatcher.evaluate('id1', {answer:123})
			.then(function(result){
				//console.log('result2=' + JSON.stringify(result));
				//console.log('state2=' + JSON.stringify(store.getState()));
				expect(result).to.deep.equals({"type":"ITEM_UPDATE_EVALRESULT","componentId":"id1","evalResult":{"descr": "test eval result", "itemId":"id1","itemState":{"mystate":123}}});
				expect(store.getState().evalResults.toObject()).to.deep.equals(expectedEvalResults);
				done();
			})
			.catch(function(error){
				done(error);
			});

		});
	});

	var testManager;
});
