# kinfunction

Allows you to run any function as a child process.

### Install

```
npm install kinfunction --save
```

### Usage

```
kinfunction(require, args, function, callback);
```

### Example

Here's an example of one function (`thefifthofnovember`) running twice and logging different a `process.pid` both times it runs. Because the child process doesn't have any access to the globals in this file we pass `"moment":"moment"` which will `require("moment")` to the variable `moment`. We also pass in the same arguments that the function takes. 

```
var moment = require("moment");
var kinfunction = require("kinfunction")

var thefifthofnovember = function(slogan, date) {
  var day = moment(new Date(date)).format("dddd");
  return slogan + " " + day + " " + process.pid;
}

var output = thefifthofnovember("remember remember", "Nov 5 2014");
console.log(output); // "remember remember Wednesday 5621"

kinfunction({
  "moment": "moment"
}, {
  "slogan": "remember remember",
  "date": "Nov 5 2014",
}, thefifthofnovember, function(err, result) {
  if (err) console.log(err);
  console.log(result); // "remember remember Wednesday 5622"
});

```