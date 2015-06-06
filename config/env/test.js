module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://heroku_app35427088:sngsofmm6fgmknul6ii4mib49e@ds059651.mongolab.com:59651/heroku_app35427088',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus',
  MANDRILL_APIKEY: process.env.MANDRILL_APIKEY || "",
  MANDRILL_USERNAME:process.env.MANDRILL_USERNAME|| "",
  HEROKU_HOST:process.env.HEROKU_HOST || "https://fiubacampus-staging.herokuapp.com" 
};
