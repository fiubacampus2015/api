var fs = require('fs');
var env = {};
var envFile = __dirname + '/env.json';

// Read env.json file, if it exists, load the id's and secrets from that
// Note that this is only in the development env
// it is not safe to store id's in files

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(function (key) {
    process.env[key] = env[key];
  });
}

module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/campus'
};
