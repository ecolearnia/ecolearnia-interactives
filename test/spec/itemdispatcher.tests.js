var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/core/storefacade';
import ItemDispatcher from '../../src/player/item/itemdispatcher';
import ItemActionFactory from '../../src/player/item/itemactionfactory';
import itemReducers from '../../src/player/item/itemreducers';
import Immutable from 'immutable';

describe('ItemDispatcher', function () {

    describe('Item action methods', function () {

		let store = null;
		let mockEvaluator = {
			evaluate: (assignId, nodeId, submissionDetails) =>
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
			return dispatcher.updateState('dummyAssignId', 'assocId1', 'id1', {answer:123})
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
            var time = new Date();
            time.setSeconds(time.getSeconds() - 10);

            store.getState().timestamps = Immutable.List.of({
				start: time, elapsedSeconds: 10,
			});

			return dispatcher.evaluate('assId', 'id1')
			.then(function(result){
				console.log('** result2=' + JSON.stringify(result));
				//console.log('state2=' + JSON.stringify(store.getState().evaluations.toObject(), null, 2));

                let expectedEvalDetails = {
                    "submission":{
                        "fields":{"mystate":123}, timestamp: result.submission.timestamp, secondsSpent: result.submission.secondsSpent
                    },
                    "evalResult":{
                        "descr": "test eval result", "nodeId":"id1",
                        // This is a product of mockEvaluator
                        "submissionDetails":{"fields": {"mystate":123}, "timestamp": result.submission.timestamp, secondsSpent: result.submission.secondsSpent}
                    }
                }

				/*expect(result).to.deep.equals({
                    "type":"ITEM_APPEND_EVALDETAILS",
                    "evalDetails": expectedEvalDetails
                });*/
                expect(result.submission.secondsSpent >= 10, 'secondsSpent is integer').to.be.true;
                expect(result, 'result do not match').to.deep.equals(expectedEvalDetails);

                const expectedEvaluations = expectedEvalDetails;

				expect(store.getState().evaluations.toObject()[0], 'store.evaluations do not match').to.deep.equals(expectedEvaluations);
			});

		});
	});

});
