const fs = require('fs');

module.exports.makeDir = function makeDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
