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
  db: process.env.MONGOLAB_URI || 'mongodb://heroku_app35427088:sngsofmm6fgmknul6ii4mib49e@ds059651.mongolab.com:59651/heroku_app35427088',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus',
  MANDRILL_APIKEY: process.env.MANDRILL_APIKEY || "qwbuII_mpMyq_pKV8AtEgw",
  MANDRILL_USERNAME:process.env.MANDRILL_USERNAME|| "app35427088@heroku.com",
  HEROKU_HOST:process.env.HEROKU_HOST || "http://localhost:3000"
};
