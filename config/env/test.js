module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/campus',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus',
  MANDRILL_APIKEY: process.env.MANDRILL_APIKEY || "qwbuII_mpMyq_pKV8AtEgw",
  MANDRILL_USERNAME:process.env.MANDRILL_USERNAME|| "app35427088@heroku.com",
  HEROKU_HOST:process.env.HEROKU_HOST || "https://fiubacampus-staging.herokuapp.com" 
};
