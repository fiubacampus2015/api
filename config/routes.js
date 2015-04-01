var users = require('../app/controllers/users');
var auth = require('./middlewares/authorization');

var authentication = [auth.requiresLogin];


module.exports = function (app, passport) {

  app.post('/apit/users', users.post);

  app.post('/api/users/authenticate', users.authenticate);

  app.get('/api/:token/users/:userId', authentication, users.get);

  app.param('userId', users.load);
  

  app.use(function (err, req, res, next) {

    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);

    res.status(500).render('500', { error: err.stack });
  });

  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}
