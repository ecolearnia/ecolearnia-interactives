var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var lodash = require('lodash');

var testutils = require('../testutils');

import LocalActivitySysRec from '../../src/player/localactivitysysrec';

// Component Under Test
import LocalEvaluator from '../../src/player/localevaluator';
var testContent = require('../data/content.test.json');

describe('LocalEvaluator', function () {

	before(function(){
	});

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
		localSysRec = new LocalActivitySysRec();
		localSysRec.add(
			{
				uuid: 'testContent',
				content: testContent
			}
		);
	});


    describe('evaluateFields', function () {

		it('should evaluate to correct', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			var data = {
				field1: 2,
				field2: 4
			};

			return evaluator.evaluateFields_(responseProcessing, data)
			.then(function (outcome) {
				//console.log('outcome=' + JSON.stringify(outcome));
				expect(outcome, 'Different outcome').to.deep.equals({
					//"_aggregate_": {"score": 1},
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

			return evaluator.evaluateFields_(responseProcessing, data)
			.then(function (outcome){
				//console.log('outcome:' + JSON.stringify(outcome));
				expect(outcome, 'Different outcome').to.deep.equals({
					//"_aggregate_": {"score": 0},
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

			return evaluator.evaluateFields_(responseProcessing, data)
			.then(function (outcome){
				//console.log('outcome:' + JSON.stringify(outcome));
				expect(outcome, 'Different outcome').to.deep.equals({
					//"_aggregate_": {"score": 0.5},
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

			evaluator.evaluateFields_(faultyResponseProcessing, data)
			.then(function (outcome){
				done('Faulty expression did not throw error');
			})
			.catch(function(error){
				done();
			});

		});
	});

	describe('helper functions', function () {
		it('should calculateAgregate_ all corrects', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});
			var evalResult = {
				fields: {
					"question1": {"score":1, "pass": true, "feedback":"Correct"},
					"question2": {"score":1, "pass": true, "feedback":"Correct"}
				}
			};
			var expected = testutils.cloneObject(evalResult);
			expected.aggregate = {
				score: 1,
				pass: true
			}
			var result = evaluator.calculateAgregate_(evalResult);
			expect(result, "Wrong aggregate score").to.deep.equals(expected);
		});

		it('should calculateAgregate_ all incorrects', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});
			var evalResult = {
				fields: {
					"question1": {"score":0, "pass": false, "feedback":"Number too large"},
					"question2": {"score":0, "pass": false, "feedback":"Incorrect"}
				}
			};
			var expected = testutils.cloneObject(evalResult);
			expected.aggregate = {
				score: 0,
				pass: false
			};
			var result = evaluator.calculateAgregate_(evalResult);
			expect(result, "Wrong aggregate score").to.deep.equals(expected);
		});

		it('should calculateAgregate_ partial corrects', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});
			var evalResult = {
				fields: {
					"question1": {"score":0, "pass": false, "feedback":"Number too large"},
					"question2": {"score":1, "pass": true, "feedback":"Correct"}
				}
			};
			var expected = testutils.cloneObject(evalResult);
			expected.aggregate = {
				score: 0.5,
				pass: false
			};
			var result = evaluator.calculateAgregate_(evalResult);
			expect(result, "Wrong aggregate score").to.deep.equals(expected);
		});

		it('should calculateAgregate_ partial with weight', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});
			var evalResult = {
				fields: {
					"question1": {"score":0, "pass": false, "feedback":"Number too large"},
					"question2": {"score":1, "pass": true, "feedback":"Correct"}
				}
			};
			var expected = testutils.cloneObject(evalResult);
			expected.aggregate = {
				score: 0.25,
				pass: false
			};
			var result = evaluator.calculateAgregate_(evalResult, 2);
			expect(result, "Wrong aggregate score").to.deep.equals(expected);
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

	describe('evaluate', function () {

		it('should submit corrects attempt', function () {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			// Init mock values, just suffice with any data and makes the array to have one element
			var submissionDetails = {
				fields: {
					field1: {value: 15},
					field2: {value: 18}
				}
			};

			return evaluator.evaluate('testAssId', 'testContent', submissionDetails)
			.then(function(evalDetails){
				let expected = [{
					"@type": "evaluation",
					"data": {
						"submission": submissionDetails,
						"evalResult": {
							"attemptNum": 1,
							"attemptsLeft": 0,
							"aggregate": {"score": 1, "pass": true},
							fields: {
								"field1": {"score":1, "pass":true, "feedback":"Correct!"},
								"field2": {"score":1, "pass":true, "feedback":"Correct2"}
							}
						}
					}
				}];
				//console.log("SysRecord.evalDetails" + JSON.stringify(localSysRec.activities_['testContent'].evalDetails));
				expect(localSysRec.activities_['testContent'].evalDetails, 'SysRecord.evalDetails does not match!')
					.to.deep.equals(expected);
				expect(evalDetails, 'evalDetails does not match!')
					.to.deep.equals(expected[0].data.evalResult);
			});
		});

		it('should reject with no more attempts', function (done) {
			evaluator = new LocalEvaluator({ sysRecords: localSysRec});

			// Init mock values, just suffice with any data and makes the array to have one element
			localSysRec.activities_['testContent'].evalDetails = [{evalResult:{dummyField:'dontcare'}}];
			var submissionDetails = {
				field1: {value: 15},
				field2: {value: 18}
			};

			return evaluator.evaluate('testAssId', 'testContent', submissionDetails)
			.then(function(){
				done("Should not have succeeded");
			})
			.catch(function(error){
				//console.log(JSON.stringify(error.message));
				expect(error.message).to.equals("NoMoreAttempts");
				done();
			});
		});
	});

	var testManager;
});
