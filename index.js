/*
Copyright Brian Ninni 2016
*/

var x,	//shorter than 'undefined'
	just = require('basic-functions'),
	Settings = {},
	//To take an object and create a RegExp that will match any of the keys
	BuildRegex = (function(){
		//Characters that need to be escaped for use in RegEx
		var regexChars = new RegExp( '[\\' + ['^','[',']','{','}','(',')','\\','/','.',',','?','-','+','*','|','$'].join('\\') + ']', 'g' );
		
		//to sort an array by length
		function sortArrayByLength(a, b){
		  return b.length - a.length;
		}
			
		//To make a string regex safe by prefixing certain certain chars with the escape char
		function makeRegexSafe( str ){
			return str.replace( regexChars, '\\$&' )
		}
		
		return function BuildRegex( o, wb ){
			var sources = Object.keys(o).sort( sortArrayByLength ).filter( just.echo ).map( makeRegexSafe ),
				str = wb ? '\\b' : '';
				
			return sources.length ?
				new RegExp( str + '(' + sources.join('|') + ')' + str ) :
				null;
		}
		
	})();

//To clone the keys from the given object to a new object
function clone( obj ){
	
	obj = obj instanceof Object ?
		obj :
		{};
		
	var key,
		ret = {};
	
	for(key in obj){
		ret[key] = obj[key];
	}
	return ret;
}

/*
	To traverse the StringTree and add the result to the Output
	Source : The Original Input Data:
		Tree : The StringTree being traversed
		Output : The output array to add the final string to
		Map : The map to replace certain values with another StringTree
		Options : The input options
			- wordBoundary : Whether or not a 'Mapped' value should only be matched if it is a separate word
			- delimiter : The string to put between each element
	Element : The current Element being handled
	Index : The index of the next Element in the StringTree
	Branch : The string corresponding the current branch of the StringTree
	Regex : The RegExp which will match any keys in the Map
	IgnoreMap : whether or not the mapping should be ignore (will be ignored if the given array was already mapped)
	useMappedDelimiter : Whether to use the Mapped Delimiter or not
*/
function BuildStringTree( Source, Map, Options, Element, Index, Branch, Regex, ignoreMap, dontAddDelimiter, useMappedDelimiter ){
	
	Map = Map === x ?
		Source.Map :
		Map;
	Options = Options === x ?
		Source.Options :
		Options;
	Element = Element === x ?
		Source.Tree[0] :
		Element;
	Index = Index === x ?
		1 :
		Index;
	Branch = Branch === x ?
		'' :
		Branch;
	Regex = Regex === x ?
		BuildRegex(Map, Options.wordBoundary) :
		Regex;
	ignoreMap = ignoreMap === x ?
		false :
		ignoreMap;
	dontAddDelimiter = dontAddDelimiter === x ?
		false :
		dontAddDelimiter;
	useMappedDelimiter = useMappedDelimiter === x ?
		false :
		useMappedDelimiter;

	var newMap, newElement, addBefore, addAfter,
		delimiterMapped = Options.delimiterMapped === x ?
			'' :
			Options.delimiterMapped,
		delimiter = Options.delimiter === x ?
			'' :
			Options.delimiter;
	
	//If the current Element is an Array, then handle each sub-Element separately
	if( Element instanceof Array ){
		return Element.forEach(function( subElement ){
			BuildStringTree( Source, x, Options, subElement instanceof Array ? StringTree( subElement, Source.Map, Source.Options ) : subElement, Index, Branch, Regex, ignoreMap, dontAddDelimiter, useMappedDelimiter )
		})
	}
	
	//Cast the Element to a String
	Element = String(Element)
			
	//If there is a Mapped value in the Element, then replace that value
	if( !ignoreMap && Element.match(Regex) ){
		newMap = clone(Map);
		//Delete each match from the new Map to prevent circular replacements
		newElement = Element.split( Regex );
		addBefore = newElement[0] === '';
		addAfter = newElement[ newElement.length-1 ] === '';
			
		newElement = newElement.filter( just.echo ).map(function(x){
			return Map.hasOwnProperty(x) ?
				delete newMap[x] && Map[x] :
				x;
		});

		if( addBefore && Branch ){
			Branch += String( delimiter );
			Branch += String( delimiterMapped );
		}
			
		return BuildStringTree( Source, x, Options, StringTreeMap( newElement, newMap, Options ), Index, Branch, x, true, addBefore, addAfter )
	}
	
	if( !dontAddDelimiter && Branch && Element ){
		if( useMappedDelimiter ) Branch += String( delimiterMapped );
		Branch += String( delimiter );
	}
	Branch += Element;
	
	//And either move to the next Element or add to the Output
	Source.Tree.hasOwnProperty( Index ) ?
		BuildStringTree( Source, x, Options, Source.Tree[Index], Index+1, Branch, Regex, x, x, dontAddDelimiter && useMappedDelimiter ) :
		Source.Output.push( Branch );
}

//Parses the given Tree and returns an array of combined strings
function StringTree( Tree, Map, Options, Output ){

	//If the given Tree is not a non-empty array, then return an empty array
	if( !(Tree instanceof Array) || !Tree.length ) return [];
		
	//Ensure the Map, Output, and Options are the correct type
	if( !(Map instanceof Object) ) Map = {}
	
	Options = createSettingsObj( Options, Settings );
	
	if( !(Output instanceof Array) ) Output = []
	
	BuildStringTree({
		Tree : Tree,
		Map : Map,
		Output : Output,
		Options : Options
	});
	
	return Output;
}

//Parses the given Tree and returns an array of combined strings
//the 'TopLevel' will use the delimiterMapped as the delimiter
function StringTreeMap( Tree, Map, Options ){
	var Output = [],
		newOptions = clone(Options);
		
	newOptions.delimiter = newOptions.delimiterMapped;
	
	BuildStringTree({
		Tree : Tree,
		Map : Map,
		Output : Output,
		Options : Options
	}, x, newOptions );
	
	return Output;
}

function createSettingsObj( obj, base ){
	obj = obj instanceof Object ?
		obj :
		{};

	return {
		delimiter : obj.hasOwnProperty('delimiter') ?
			obj.delimiter :
			base.delimiter,
		delimiterMapped : obj.hasOwnProperty('delimiterMapped') ?
			obj.delimiterMapped :
			base.delimiterMapped,
		wordBoundary : obj.hasOwnProperty('wordBoundary') ?
			obj.wordBoundary :
			base.wordBoundary
	};
}

function Parse( Tree, Map, Options ){
	return StringTree( Tree, Map, Options );
};

Parse.defineSettings = function( obj ){
	Settings = createSettingsObj( obj, Settings )
	return Parse;
}

Parse.each = function( Trees, Map, Options ){
	var Output = [];
	
	Trees.forEach(function(Tree){
		StringTree( Tree, Map, Options, Output );
	})
	
	return Output;
}

module.exports = Parse;