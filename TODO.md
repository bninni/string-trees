* Allow delimiterMapped to map to each replacement value

```javascript
var map = {
  hi : ['hi','hey']
},
options : {
  delimiterMapped = {
    hi : ','
  }
}
```

* Give delimiterMapped separate before and after values

```javascript
var map = {
  hi : ['hi','hey']
},
options : {
  delimiterMappedAfter = ','
}
```

* Incorporate the options into the Map

```javascript
var map = {
  hi : {
    value : ['hi','hey'],
    delimiterAfter : ','
  }
}
```