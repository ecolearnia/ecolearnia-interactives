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
            itemWrapper.setContent('mockId', testContent);
            expect(itemWrapper.nodeId_).to.equal("mockId");
            expect(itemWrapper.content_).to.equal(testContent);
            expect(mockStore.reset.calledOnce).to.true;
        });

		it('should renderTemplateString', function () {
            itemWrapper.setContent('mockId', testContent);

            let result = itemWrapper.renderTemplateString("<%=num1%> <%=data2%>");
            expect(result).to.equal("-1 test-data");
		});
	});

	var testManager;
});
