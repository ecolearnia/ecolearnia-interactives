var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import StoreFacade from '../../src/core/storefacade';
import ItemWrapper from '../../src/player/item/itemwrapper';
var testContent = require('../data/content.test.json');

describe('ItemWrapper', function () {

    describe('ItemWrapper helper methods', function () {

        let itemWrapper;

        let mockStore = {
            reset: function(){}
        }

        let sinonSandbox;

		beforeEach(function(){
            sinonSandbox = sinon.sandbox.create();
            sinonSandbox.stub(mockStore, 'reset');

            let itemConfig = {
                componentModule: 'mockComponentModule',
                store: mockStore,
                dispatcher: 'mockDispatcher'
            }

            // The package name as specified when building the library
	        itemWrapper = new ItemWrapper(itemConfig);

		});

		afterEach(function(){
            sinonSandbox.restore();
		});

        it('should setContent', function () {
            var activityDetails = {
                assignmentUuid: 'mockAssId',
                uuid: 'mockId',
                content: testContent
            };

            itemWrapper.setContent(activityDetails);
            expect(itemWrapper.activityId_, "activityId is wrong").to.equal("mockId");
            expect(itemWrapper.content_, "content is wrong").to.equal(testContent);
            expect(mockStore.reset.calledOnce).to.true;
        });

		it('should renderTemplateString', function () {
            var activityDetails = {
                assignmentUuid: 'mockAssId',
                uuid: 'mockId',
                content: testContent
            };
            itemWrapper.setContent(activityDetails);

            let result = itemWrapper.renderTemplateString("<%=num1%> <%=data2%>");
            expect(result).to.equal("-1 test-data");
		});
	});

	var testManager;
});
