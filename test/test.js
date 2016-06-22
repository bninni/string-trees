var StringTrees = require('../index'),
	assert = require('assert'),
	vows = require('vows');

vows.describe('Test').addBatch({
	'Combining Strings':{
		'Single String' : function(){
			var result = StringTrees(['hi, ','how ','are ','you?']);
			assert.deepEqual( result, ['hi, how are you?'] );
		},
		'Replacement Words' : function(){
			var result = StringTrees([['hi','hey'],', how ','are ','you?']),
				expect = [
					'hi, how are you?',
					'hey, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Nested Replacements' : function(){
			var result = StringTrees([
					[[
						['hi ','hey '],
						['there',[['buddy','friend']]]
					]],
					', how ','are ','you?']),
				expect = [
					'hi there, how are you?',
					'hi buddy, how are you?',
					'hi friend, how are you?',
					'hey there, how are you?',
					'hey buddy, how are you?',
					'hey friend, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Using Delimiters' : function(){
			var options = {
					delimiter : ' '
				},
				result = StringTrees(['hi,','how','are','you?'], null, options );
			assert.deepEqual( result, ['hi, how are you?'] );
		},
	},
	'Mapping Values':{
		'Single Replacement' : function(){
			var map = {
					'hi' : 'hey'
				},
				result = StringTrees(['hi, ','how ','are ','you?'], map);
			assert.deepEqual( result, ['hey, how are you?'] );
		},
		'Multiple Replacement' : function(){
			var map = {
					'hi' : ['hey','hello']
				},
				result = StringTrees(['hi, ','how ','are ','you?'], map),
				expect = [
					'hey, how are you?',
					'hello, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Using Delimiters' : function(){
			var map = {
					'hi' : ['hey','hello']
				},
				options = {
					delimiter : ' ',
					delimiterMapped : ','
				},
				result = StringTrees(['hi','how','are','you?'], map, options),
				expect = [
					'hey, how are you?',
					'hello, how are you?'
				];
				
			assert.deepEqual( result, expect );
		},
		'Single Circular Replacement' : function(){
			var map = {
					'hi' : 'hi'
				},
				result = StringTrees(['hi, ','how ','are ','you?'], map),
				expect = [
					'hi, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Multiple Circular Replacement' : function(){
			var map = {
					'hi' : 'hey',
					'hey' : 'hi'
				},
				result = StringTrees(['hi, ','how ','are ','you?'], map),
				expect = [
					'hi, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Multiple Replacement' : function(){
			var map = {
					'hi' : 'hey',
					'hey' : 'hello'
				},
				result = StringTrees(['hi, ','how ','are ','you?'], map),
				expect = [
					'hello, how are you?'
				];
			assert.deepEqual( result, expect );
		},
		'Ignoring Word Boundary' : function(){
			var map = {
					'hi' : 'hey'
				},
				result = StringTrees(['hi, ','this ','is ','a ', 'test'], map),
				expect = [
					'hey, theys is a test'
				];
			assert.deepEqual( result, expect );
		},
		'Word Boundary Only' : function(){
			var map = {
					'hi' : 'hey'
				},
				options = {
					wordBoundary : true
				},
				result = StringTrees(['hi, ','this ','is ','a ', 'test'], map, options),
				expect = [
					'hey, this is a test'
				];
			assert.deepEqual( result, expect );
		},
	}
}).exportTo(module);