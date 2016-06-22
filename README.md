# string-trees
[![Build Status](https://travis-ci.org/bninni/string-trees.svg?branch=master)](https://travis-ci.org/bninni/string-trees)

Combine each branch in a Tree of Strings into its own string

## Install
```
npm install string-trees
```
or
```
npm install -g string-trees
```

Then import the module into your program:

```javascript
var StringTrees = require('string-trees');
```

## Usage

A String Tree is an Array of Strings
  - An array can be used instead of Strings to represent multiple values to use

**StringTrees( Tree, Map, Options )**
* _Tree_ (**Array**) - The String Tree to parse
* _Map_ (**Object**) - The Map of Strings to replace with other Strings/StringTrees
* _Options_ (**Object**) - The Options
  * _wordBoundary_ (**Boolean**) - Whether or not the Map should only replace whole words that match
    * Default : `false`
  * _delimiter_ (**String**) - The Sring to place in between each string in the Tree
    * Default : `''`
  * _delimiterMapped_ (**String**) - The Sring to wrap around each mapped string
    * Default : `''`  

## Examples

**Combining Strings**

```javascript
var strings = ['hi ','how ','are ','you?']

StringTrees( strings ) == [
  'hi how are you?'
]
```

**Combing Strings with Multiple Values**

```javascript
var strings = [
  ['hi ','hey '],
  'how ','are ','you?'
]

StringTrees( strings ) == [
  'hi how are you?',
  'hey how are you?'
]
```

**Replacing Strings**

```javascript
var strings = ['hi ','how ','are ','you?'],
  map = {
    'hi' : ['hi','hey']
  };

StringTrees( strings, map ) == [
  'hi how are you?',
  'hey how are you?',
]
```

**Combing Strings with Delimiters**

```javascript
var strings = ['hi','how','are','you?'],
  map = {
    'hi' : ['hi','hey']
  },
  options = {
    delimiter : ' '
  }

StringTrees( strings, map, options ) == [
  'hi how are you?',
  'hey how are you?'
]
```

**Replacement Delimiters**

```javascript
var strings = ['hi','how','are','you?'],
  map = {
    'hi' : ['hi','hey']
  },
  options = {
    delimiter : ' ',
    delimiterMapped : ','
  }

StringTrees( strings, map, options ) == [
  'hi, how are you?',
  'hey, how are you?'
]
```

**Replace Full Words Only**

```javascript
var strings = ['hi','this','is','a','test'],
  map = {
    'hi' : ['hi','hey']
  },
  options = {
    delimiter : ' ',
    delimiterMapped : ',',
  wordBoundary : true
  }

StringTrees( strings, map, options ) == [
  'hi, this is a test',
  'hey, this is a test'
]

//Without the wordBoundary option:
[
  'hi, theys is a test',
  'hey, theys is a test'
]
```

# License

## MIT