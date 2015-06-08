module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://heroku_app35363259:rcjlbp1f9qcmou9bctblli8g6n@ds031957.mongolab.com:31957/heroku_app35363259',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus',
  MANDRILL_APIKEY: process.env.MANDRILL_APIKEY || "qwbuII_mpMyq_pKV8AtEgw",
  MANDRILL_USERNAME:process.env.MANDRILL_USERNAME|| "app35427088@heroku.com",
  HEROKU_HOST:process.env.HEROKU_HOST || "https://fiubacampus.herokuapp.com" 
};
