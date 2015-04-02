module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/campus',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'campus'
};
