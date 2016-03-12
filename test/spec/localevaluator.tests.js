var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var lodash = require('lodash');

import LocalNodeSysRec from '../../src/player/localnodesysrec';

// Component Under Test
import LocalEvaluator from '../../src/player/localevaluator';
var testContent = require('../data/content.test.json');

describe('LocalEvaluator', function () {

	before(function(){
	});

    describe('evaluate', function () {
		var evaluator;

		// Correct answers: field1=2, field2=4
		var responseProcessing = {
			"when": [
				{
					"case": "true",
					"then": {
						"question1.score": 0,
						"question2.score": 0,
					}
				},
				{
					"case": " $field1 > 2",
					"then": {
						"question1.score": 0,
						"question1.feedback": "Number too large"
					}
				},
				{
					"case": "$field1 == $field2",
					"then": {
						"question1.score": 0,
						"question2.score": 0,
						"question1.feedback": "Fields cannot be same"
					}
				},
				{
					"case": "$field1 * $field1 == 4",
					"then": {
						"question1.score": 1,
						"question1.feedback": "Correct"
					}
				},
				{
					"case": "$field2 * $field2 == 16",
					"then": {
						"question2.score": 1,
						"question2.feedback": "Correct"
					}
				}
			]
		};
		var localSysRec;
		beforeEach(function(){
			localSysRec = new LocalNodeSysRec();
			localSysRec.add(
				{
					id: 'testContent',
					content: testContent
				}
			);
		});

		it('should evaluate to correct', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			var data = {
				field1: 2,
				field2: 4
			};

			return evaluator.evaluateLocal_(responseProcessing, data)
			.then(function (outcome) {
				//console.log('outcome=' + JSON.stringify(outcome));
				expect(outcome).to.deep.equals({
					"_aggregate_": {"score": 1},
					"question1": {"score":1, "feedback":"Correct"},
					"question2": {"score":1, "feedback":"Correct"}
				});
			});


		});

		it('should evaluate to incorrect', function () {
			evaluator = new LocalEvaluator({});

			var data = {
				field1: 3,
				field2: 3
			};

			return evaluator.evaluateLocal_(responseProcessing, data)
			.then(function (outcome){
				//console.log('outcome:' + JSON.stringify(outcome));
				expect(outcome).to.deep.equals({
					"_aggregate_": {"score": 0},
					"question1": {"score":0, "feedback":"Fields cannot be same"},
					"question2": {"score":0}
				});
			});

		});

		it('should evaluate to partial correct', function () {
			evaluator = new LocalEvaluator({});

			var data = {
				field1: 3,
				field2: 4
			};

			return evaluator.evaluateLocal_(responseProcessing, data)
			.then(function (outcome){
				//console.log('outcome:' + JSON.stringify(outcome));
				expect(outcome).to.deep.equals({
					"_aggregate_": {"score": 0.5},
					"question1": {"score":0, "feedback":"Number too large"},
					"question2": {"score":1, "feedback":"Correct"}
				});
			});

		});

		it('should throw error ', function (done) {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			var data = {
				_field1: 3,
			};

			var faultyResponseProcessing = {
				"when": [
					{
						"case": " ${field1} > 2",
						"then": {
							"question1.score": 0,
						}
					}
				]
			}

			evaluator.evaluateLocal_(faultyResponseProcessing, data)
			.then(function (outcome){
				done('Faulty expression did not throw error');
			})
			.catch(function(error){
				done();
			});

		});

		it('should combineSubmissionData', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			var mockItemPlayer = {
				getAssociationId: function() { return testAssociationId },
		        // The response processing rule
		        getContent: function() {
					return testContent;
				}
			};

			//evaluator.registerContent(testAssociationId, testContent);

			var data = {
				field1: {
					key: "two",
					value: 2,
				},
				field2: 3
			};

			var result = evaluator.combineSubmissionData_(testContent.variableDeclarations, data);

			var expected = {
				field1: {
					key: "two",
					value: 2,
				},
				field2: 3,
				"field1_key": "two",
				"field1_value": 2,
				"var_num1": -1,
				"var_data2": "test-data"
			};
			expect(result).to.deep.equal(expected)
		});
	});

	var testManager;
});
