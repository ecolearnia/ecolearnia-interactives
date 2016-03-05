var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import RandomVarSequencingStrategy from '../../src/player/assignment/randomvarsequencingstrategy';

var testContent = require('../data/content.test.json');

describe('RandomVarSequencingStrategy', function () {

	before(function(){
	});

    describe('Initialize', function () {

		let sequencingStrategy;

		it('should retrieveNextNode', function (done) {
			var config = {
				templateContent: testContent
			}
			sequencingStrategy = new RandomVarSequencingStrategy(config);

			let assignmentContext = {};
			sequencingStrategy.retrieveNextNode(assignmentContext)
			.then(function(data) {
				expect(data.associationId).to.not.null;
				expect(data.content).to.not.null;
				expect(data.content.variableDeclarations.num1.value > 1).to.be.true;
				done();
			});

		});

	});

});
