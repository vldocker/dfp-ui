const contains = function(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

const csvJSON = function(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return JSON.stringify(result);
}

const getPropertyValues = function(property, jsonObj) {
  var values = [];
  for (var i = 0; i < jsonObj.length; i++) {
    values.push(jsonObj[i][property]);
  }

  return Array.from(new Set(values));
}

const stdoutToJson = function(stdout) {
  var stdoutStr = stdout.toString()
  var confObjIdx = stdoutStr.indexOf('[');
  var confObj = stdoutStr.substr(confObjIdx);
  var jsonStr = JSON.stringify(confObj);
  var jsonObj = JSON.parse(jsonStr);

  return eval(jsonObj);
}

module.exports = {
  contains,
  csvJSON,
  getPropertyValues,
  stdoutToJson
}
