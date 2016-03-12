var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/player/storefacade';
import ItemDispatcher from '../../src/player/item/itemdispatcher';
import ItemActionFactory from '../../src/player/item/itemactionfactory';
import itemReducers from '../../src/player/item/itemreducers';
import Immutable from 'immutable';

describe('ItemDispatcher', function () {

    describe('Item action methods', function () {

		let store = null;
		let mockEvaluator = {
			evaluate: (nodeId, submissionDetails) =>
			{
				//console.log(itemId, itemState);
				// for the
				return Promise.resolve({descr: 'test eval result', nodeId, submissionDetails});
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
                evaluator: mockEvaluator,
				actionFactory: new ItemActionFactory()
			});
            dispatcher.setStore(store);

            // @todo updateState will be changed to Promise
			return dispatcher.updateState('assocId1', 'id1', {answer:123})
            .then(function(result){

                const expectedStateItems = {
    				"fields":{"answer":123}
    			};
    			//console.log('state/updateState=' + JSON.stringify(store.getState()));
    			expect(result).to.deep.equals({"type":"ITEM_UPDATE_STATE","componentId":"id1","state":{"answer":123}});

    			// getState().items is of type Immutable
    			expect(store.getState().components.toObject()).to.deep.equals(expectedStateItems);
            });

		});

		it('should evaluate', function () {
			let dispatcher = new ItemDispatcher({
                evaluator: mockEvaluator,
				actionFactory: new ItemActionFactory()
			});
            dispatcher.setStore(store);

			store.getState().components = Immutable.Map({
				id1 : { mystate: 123 }
			});

			return dispatcher.evaluate('id1')
			.then(function(result){
				console.log('result2=' + JSON.stringify(result));
				//console.log('state2=' + JSON.stringify(store.getState().evaluations.toObject(), null, 2));

                let expectedEvalDetails = {
                    "submission":{"fields":{"mystate":123}, timestamp: result.submission.timestamp},
                    "evalResult":{"descr": "test eval result", "nodeId":"id1","submissionDetails":{"fields": {"mystate":123}, "timestamp": result.submission.timestamp}}
                }

				/*expect(result).to.deep.equals({
                    "type":"ITEM_APPEND_EVALDETAILS",
                    "evalDetails": expectedEvalDetails
                });*/
                expect(result, 'result do not match').to.deep.equals(expectedEvalDetails);

                const expectedEvaluations = expectedEvalDetails;

				expect(store.getState().evaluations.toObject()[0], 'store.evaluations do not match').to.deep.equals(expectedEvaluations);
			});

		});
	});

	var testManager;
});
