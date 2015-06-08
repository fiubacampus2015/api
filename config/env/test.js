module.exports = {
  db: process.env.MONGOLAB_URI || '',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus',
  MANDRILL_APIKEY: process.env.MANDRILL_APIKEY || "",
  MANDRILL_USERNAME:process.env.MANDRILL_USERNAME|| "",
  HEROKU_HOST:process.env.HEROKU_HOST || "https://fiubacampus-staging.herokuapp.com" 
};
