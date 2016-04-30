var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import ItemPlayer from '../../src/player/item/itemplayer';
var testContent = require('../data/content.test.json');

describe('ItemPlayer', function () {

    describe('ItemPlayer helper methods', function () {

        let itemPlayer;

		beforeEach(function(){
            var settings = {
                pubsub :'mockPubSub',
                activityProvider: 'mockActivityProvider',
                componentNamespace: 'interactives'
            };

            // The package name as specified when building the library
	        itemPlayer = new ItemPlayer(settings);
		});

		afterEach(function(){

		});

		it('should initialize', function () {
            expect(itemPlayer.logger_).to.not.null;
            expect(itemPlayer.pubsub).to.equal('mockPubSub');
            expect(itemPlayer.componentModule_).to.not.null;
            expect(itemPlayer.activityProvider_).to.equal('mockActivityProvider');
            expect(itemPlayer.store_).to.not.null;
            expect(itemPlayer.dispatcher_).to.not.null;
		});
	});

	var testManager;
});
