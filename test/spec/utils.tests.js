var expect = require('chai').expect;
var sinon = require('sinon');
var lodash = require('lodash');

import utils from '../../libs/common/utils';

describe('utils', function () {;

	var testObj = {
	   "foo": {
		 "bar": {
		   "baz1": "baz-val1",
		   "baz2": "baz-val2"
		 }
	   }
   };

	before(function(){
	});

	describe('dotAccess', function () {
		it('should get value', function () {
			var result = utils.dotAccess(testObj, 'foo.bar.baz1');
			expect (result).to.equal("baz-val1");
		});

		it('should get undefined value for non-existent property', function () {
			var result = utils.dotAccess(testObj, 'foo.NONEXISTENT');
			expect (result).to.equal(undefined);
		});

		it('should get undefined value for non-existent nested property', function () {
			var result = utils.dotAccess(testObj, 'foo.NONEXISTENT.NONEXISTENT2');
			expect (result).to.equal(undefined);
		});

		it('should set property', function () {
			var obj = JSON.parse(JSON.stringify(testObj));
			utils.dotAccess(obj, 'foo.bar.baz1', 'newbaz1');
			var expectedObj = {
			   "foo": {
				 "bar": {
				   "baz1": "newbaz1",
				   "baz2": "baz-val2"
				 }
			   }
			}
			expect (obj).to.deep.equal(expectedObj);
		});

		it('should add new property', function () {
			var obj = JSON.parse(JSON.stringify(testObj));
			utils.dotAccess(obj, 'foo.bar.baz3', 'baz-val3');
			var expectedObj = {
			   "foo": {
				 "bar": {
				   "baz1": "baz-val1",
				   "baz2": "baz-val2",
				   "baz3": "baz-val3"
				 }
			   }
			}
			expect (obj).to.deep.equal(expectedObj);
		});

		it('should add new nested property ', function () {
			var obj = JSON.parse(JSON.stringify(testObj));
			utils.dotAccess(obj, 'foo.bar2.baz3', 'baz-val3');
			var expectedObj = {
			   "foo": {
				 "bar": {
				   "baz1": "baz-val1",
				   "baz2": "baz-val2"
			   	 },
				 "bar2": {
  				   "baz3": "baz-val3"
				 }
			   }
			}
			expect (obj).to.deep.equal(expectedObj);
		});
	});

    describe('hydrate', function () {

		it('should hydrate', function () {

			let data = {
		       "foo.bar.baz1": "baz-val1",
		       "foo.bar.baz2": "baz-val2"
		   	};
			var result = utils.hydrate(data);
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
			var result = utils.hydrate(data);
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
			var result = utils.dehydrate(data);
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
			var result = utils.dehydrate(data, null, '_');
			var expected = {
		       "foo_bar_baz1": "baz-val1",
		       "baz2": "baz-val2"
		   };
			expect(result).to.deep.equals(expected);
		});

		it('should dehydrate empty content', function () {

			let data = {
		   	};
			var result = utils.hydrate(data);
			var expected = {
		    }
			expect(result).to.deep.equals(expected);
		});

	});

	describe('shuffleArray', function () {

		it('should shuffleArray', function () {
			var fieldPositions = [
	            [0,0], [0,1], [1,0], [1,1], [2,1], [1,2]
	        ];
			let shuffle = JSON.parse(JSON.stringify(fieldPositions));
			let result = utils.shuffleArray(shuffle);

			//console.log("original:" + JSON.stringify(fieldPositions));
			//console.log("shuffled:" + JSON.stringify(result));

			expect(result, 'Shuffle resulted same').to.not.deep.equal(fieldPositions);
		});
	});

	describe('permutate', function () {

		it('should permutate', function () {
			var fieldPositions = [
	            [0,0], [0,1], [1,0], [1,1]
	        ];
			let parmutations = JSON.parse(JSON.stringify(fieldPositions));
			let result = utils.permutate(parmutations);

			//console.log("permutations:" + JSON.stringify(result));

			let expected = [
				[[0,0],[0,1],[1,0],[1,1]],
				[[0,0],[0,1],[1,1],[1,0]],
				[[0,0],[1,0],[0,1],[1,1]],
				[[0,0],[1,0],[1,1],[0,1]],
				[[0,0],[1,1],[0,1],[1,0]],
				[[0,0],[1,1],[1,0],[0,1]],
				[[0,1],[0,0],[1,0],[1,1]],
				[[0,1],[0,0],[1,1],[1,0]],
				[[0,1],[1,0],[0,0],[1,1]],
				[[0,1],[1,0],[1,1],[0,0]],
				[[0,1],[1,1],[0,0],[1,0]],
				[[0,1],[1,1],[1,0],[0,0]],
				[[1,0],[0,0],[0,1],[1,1]],
				[[1,0],[0,0],[1,1],[0,1]],
				[[1,0],[0,1],[0,0],[1,1]],
				[[1,0],[0,1],[1,1],[0,0]],
				[[1,0],[1,1],[0,0],[0,1]],
				[[1,0],[1,1],[0,1],[0,0]],
				[[1,1],[0,0],[0,1],[1,0]],
				[[1,1],[0,0],[1,0],[0,1]],
				[[1,1],[0,1],[0,0],[1,0]],
				[[1,1],[0,1],[1,0],[0,0]],
				[[1,1],[1,0],[0,0],[0,1]],
				[[1,1],[1,0],[0,1],[0,0]]
			];

			expect(result, 'Parmutations failed').to.deep.equal(expected);
		});
	});

});
