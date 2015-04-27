var users = require('../app/controllers/users'),
  auth = require('./middlewares/authorization'),
  authentication = [auth.requiresLogin];

module.exports = function (app, passport) {

  app.post('/api/users', users.post, auth.sendConfirmation);

  app.get('/api/users/:userId/confirm/:confirmation', auth.confirm, users.showConfirm);

  app.post('/api/users/authenticate', users.authenticate);

  app.get('/api/:token/users/:userId', authentication, users.get);

  app.put('/api/:token/users/:userId', authentication, users.put);

  app.get('/api/:token/users/:user/friends', authentication, users.friends);

  app.put('/api/:token/users/:userId/:friendId', authentication, users.addFriend);

  app.get('/api/:token/people', authentication, users.search);

  app.get('/api/:token/users', authentication, users.search);

  app.get('/app/download', function(req, res, next){
    res.render('index', {});
  });


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
