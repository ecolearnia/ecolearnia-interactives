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

		it('should updateState', function (done) {
			let dispatcher = new ItemDispatcher({
                evaluator: mockEvaluator,
				actionFactory: new ItemActionFactory()
			});
            dispatcher.setStore(store);

            // @todo updateState will be changed to Promise
			dispatcher.updateState('assocId1', 'id1', {answer:123})
            .then(function(result){

                const expectedStateItems = {
    					"id1":{"answer":123}
    			};
    			//console.log('state/updateState=' + JSON.stringify(store.getState()));
    			expect(result).to.deep.equals({"type":"ITEM_UPDATE_STATE","componentId":"id1","state":{"answer":123}});

    			// getState().items is of type Immutable
    			expect(store.getState().components.toObject()).to.deep.equals(expectedStateItems);

                done();
            });

		});

		it('should evaluate', function (done) {
			let dispatcher = new ItemDispatcher({
                evaluator: mockEvaluator,
				actionFactory: new ItemActionFactory()
			});
            dispatcher.setStore(store);

			store.getState().components = Immutable.Map({
				id1 : { mystate: 123 }
			});

			dispatcher.evaluate('id1')
			.then(function(result){
				console.log('result2=' + JSON.stringify(result));
				//console.log('state2=' + JSON.stringify(store.getState().evaluations.toObject(), null, 2));

                let expectedEvalDetails = {
                    "submission":{"fields":{"mystate":123}, timestamp: result.submission.timestamp},
                    "evalResult":{"descr": "test eval result", "itemId":"id1","itemState":{"mystate":123}}
                }

				/*expect(result).to.deep.equals({
                    "type":"ITEM_APPEND_EVALDETAILS",
                    "evalDetails": expectedEvalDetails
                });*/
                expect(result).to.deep.equals(expectedEvalDetails);

                const expectedEvaluations = expectedEvalDetails;

				expect(store.getState().evaluations.toObject()[0]).to.deep.equals(expectedEvaluations);
				done();
			})
			.catch(function(error){
				done(error);
			});

		});
	});

	var testManager;
});
