var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import logger from '../../libs/common/logger';

describe.only('Logger', function () {;

	var log;
	before(function(){
		log = logger.getLogger('test');
	});

	describe('log', function () {
		it('should get value', function () {
			log.debug('1 - log: message only');
			log.info({data:'data'}, '2 - log: context and message');
			log.warn({data:'data'}, '3 - log: context and message args', 'msg2', 'msg3');
			log.error({data:'data'}, '4 - log: context and message args in obj', {msg2: 'msg2'});
			log.fatal('5 - log: only messages args', 'msg2', 'msg3');
		});
	});

});
