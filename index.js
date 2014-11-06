var cp = require('child_process');
var helper = {};

helper.argsStirngify = function(args) {
  var globalify = function(args) {
    for (var item in args) {
      global[item] = args[item];
    }
  };
  var str = "";
  str += "var globalify = " + globalify + ";";
  str += "var args = '" + JSON.stringify(args) + "';";
  str += "args = JSON.parse(args);";
  str += "globalify(args);";
  return str;
}

helper.funcStringify = function(main) {
  var ret = function(value) {
    console.log(JSON.stringify(value));
  };
  var str = "";
  str += "var ret = " + ret + ";"
  var main_str = "" + main;
  main_str = main_str.replace(/^function\s\(.+\)/, "function ()");
  str += "var main = " + main_str + ";"
  str += "ret(main());";
  return str;
}

helper.reqStringify = function(req) {
  var requireify = function(req) {
    for (var item in req) {
      global[item] = require(req[item]);
    }
  };
  var str = "";
  str += "var requireify = " + requireify + ";";
  str += "var req = '" + JSON.stringify(req) + "';";
  str += "req = JSON.parse(req);";
  str += "requireify(req);";
  return str;
}

helper.evalStringify = function(str) {
  str = str.replace(/(\r\n|\n|\r)/gm, "")
  str = JSON.stringify(str);
  return str;
}

helper.kinfunction = function(req, args, func, callback) {
  var str = "";
  str += helper.reqStringify(req);
  str += helper.argsStirngify(args);
  str += helper.funcStringify(func);
  str = helper.evalStringify(str);
  var exec = cp.exec;
  exec("node -e " + str, function(error, stdout, stderr) {
    if (callback) {
      if (error) return callback(error);
      if (stderr) return callback(stderr);
      var result = JSON.parse(stdout);
      return callback(null, result);
    }
  });
}

module.exports = helper.kinfunction;