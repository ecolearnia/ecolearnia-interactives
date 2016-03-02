var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import LocalEvaluator from '../../src/core/localevaluator';
var testContent = require('../data/content.test.json');

describe('LocalEvaluator', function () {

	before(function(){
	});

    describe('evaluate', function () {
		var evaluator;

		var responseProcessing = {
			"when": [
				{
					"case": " $field1 > 2",
					"then": {
						"question1.correct": false,
						"question1.feedback": "Number too large"
					}
				},
				{
					"case": "$field1 == $field2",
					"then": {
						"question1.correct": false,
						"question1.feedback": "Fields cannot be same"
					}
				},
				{
					"case": "$field1 * $field1 == 4",
					"then": {
						"question1.correct": true,
						"question1.feedback": "Correct"
					}
				}
			]
		};

		it('should evaluate to correct', function (done) {
			evaluator = new LocalEvaluator();

			var data = {
				field1: 2,
				field2: 3
			};

			evaluator.evaluateLocal_(responseProcessing, data)
			.then(function (outcome) {
				//console.log('outcome=' + JSON.stringify(outcome));
				expect(outcome).to.deep.equals({"question1": {"correct":true, "feedback":"Correct"}});
				done();
			});

		});

		it('should evaluate to incorrect', function (done) {
			evaluator = new LocalEvaluator();

			var data = {
				field1: 3,
				field2: 3
			};

			evaluator.evaluateLocal_(responseProcessing, data)
			.then(function (outcome){
				//console.log('outcome:' + JSON.stringify(outcome));
				expect(outcome).to.deep.equals({"question1": {"correct":false, "feedback":"Fields cannot be same"}});
				done();
			});

		});

		it('should throw error ', function (done) {
			evaluator = new LocalEvaluator();

			var data = {
				_field1: 3,
			};

			var faultyResponseProcessing = {
				"when": [
					{
						"case": " ${field1} > 2",
						"then": {
							"question1.correct": false,
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
			evaluator = new LocalEvaluator();

			var testAssociationId = '123';
			var mockItemPlayer = {
				getAssociationId: function() { return testAssociationId },
		        // The response processing rule
		        getContent: function() {
					return testContent;
				}
			};

			evaluator.registerContent(testAssociationId, testContent);

			var data = {
				field1: {
					key: "two",
					value: 2,
				},
				field2: 3
			};

			var result = evaluator.combineSubmissionData_(testAssociationId, data);

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
