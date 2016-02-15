var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import {hydrate,  dehydrate} from '../../libs/common/utils';

describe('utils', function () {

	before(function(){
	});

	function testReducer (state = {}, action) {
		return state;
	}
    describe('hydrate', function () {

		it('should hydrate', function () {

			let data = {
		       "foo.bar.baz1": "baz-val1",
		       "foo.bar.baz2": "baz-val2"
		   	};
			var result = hydrate(data);
			var expected = {
		       "foo": {
		         "bar": {
		           "baz1": "baz-val1",
		           "baz2": "baz-val2"
		         }
		       }
		    }
			expect(result).to.deep.equals(expected);
		});

		it('should hydrate', function () {

			let data = {
		   	};
			var result = hydrate(data);
			var expected = {
		    }
			expect(result).to.deep.equals(expected);
		});

	});

	describe('dehydrate', function () {

		it('should dehydrate', function () {

			let data = {
		       "foo": {
		         "bar": {
		           "baz1": "baz-val1",
		           "baz2": "baz-val2"
		         }
		       }
		    };
			var result = dehydrate(data);
			var expected = {
		       "foo.bar.baz1": "baz-val1",
		       "foo.bar.baz2": "baz-val2"
		   };
			expect(result).to.deep.equals(expected);
		});

		it('should dehydrate with non-default dotChar', function () {

			let data = {
		       "foo": {
		         "bar": {
		           "baz1": "baz-val1"
		         }
			 },
			 "baz2": "baz-val2"
		    };
			var result = dehydrate(data, null, '_');
			var expected = {
		       "foo_bar_baz1": "baz-val1",
		       "baz2": "baz-val2"
		   };
			expect(result).to.deep.equals(expected);
		});

		it('should dehydrate empty content', function () {

			let data = {
		   	};
			var result = hydrate(data);
			var expected = {
		    }
			expect(result).to.deep.equals(expected);
		});

	});

});
