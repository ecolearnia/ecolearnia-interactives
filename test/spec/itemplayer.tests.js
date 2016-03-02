var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import ItemPlayer from '../../src/core/itemplayer';
var testContent = require('../data/content.test.json');

describe('ItemPlayer', function () {

    describe('ItemPlayer helper methods', function () {

        let itemPlayer;

		beforeEach(function(){
            var settings = {};
            settings.content = testContent;
            // The package name as specified when building the library
            settings.componentNamespace = 'interactives';
	        itemPlayer = new ItemPlayer(settings);
		});

		afterEach(function(){

		});

		it('should renderTemplateString', function () {
            let result = itemPlayer.renderTemplateString("<%=num1%> <%=data2%>");
            expect(result).to.equal("-1 test-data");
		});
	});

	var testManager;
});
