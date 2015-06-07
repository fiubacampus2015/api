var users = require('../app/controllers/users'),
  groups = require('../app/controllers/groups'),
  auth = require('./middlewares/authorization'),
  authentication = [auth.requiresLogin];

module.exports = function (app, passport) {

  app.post('/api/users', users.post, auth.sendConfirmation);

  app.get('/api/users/:userId/confirm/:confirmation', auth.confirm, users.showConfirm);


  // FOR FRONT

  app.get('/api/groups', groups.all);
  app.get('/api/forums', groups.allForums);
  app.get('/api/forums/:id', groups.showForum);
  app.get('/api/users/:id', users.show);
  app.put('/api/users/:userId', users.put);
  app.get('/api/users', users.all);
  
  app.get('/api/groups/:id', groups.show);
  app.get('/api/groups/:groupId/forums', groups.searchForum, function(req, res) {
    res.status(200).json(req.forums)
  });

  
  // USERS

  app.post('/api/users/authenticate', users.authenticate);

  app.get('/api/:token/users/:userId', authentication, users.get);

  app.put('/api/:token/users/:userId', authentication, users.put);

  app.get('/api/:token/users/:user/friends', authentication, users.friends);

  app.get('/api/:token/users/:user/friends/pending', authentication, users.pending);

  app.put('/api/:token/users/:userId/:friendId', authentication, users.addFriend);

  app.post('/api/:token/users/:userId/:friendId/delete', authentication, users.deleteFriend);

  app.put('/api/:token/users/:userId/:friendId/confirm', authentication, users.confirmFriend);

  app.put('/api/:token/users/:userId/:friendId/reject', authentication, users.rejectFriend);

  app.get('/api/:token/people', authentication, users.search);

  app.get('/api/:token/users', authentication, users.search);

  app.get('/api/:token/users/:user/wall', authentication, users.wallGet);

  app.post('/api/:token/users/:user/wall', authentication, users.wallPost); 

  app.post('/api/:token/users/:user/walldelete', authentication, users.wallDelete);
  app.post('/api/:token/users/:user/position', authentication, users.positionPost);

  // GROUPS

  app.post('/api/:token/groups', authentication, groups.create);

  app.put('/api/:token/groups/:groupId', authentication, groups.put);
  
  app.post('/api/:token/groups/delete', authentication, groups.delete);

  app.post('/api/:token/groups/:groupId/subscribe', authentication, groups.subscribe);
  
  app.put('/api/:token/groups/:groupId/subscribe/:susId/resolve', authentication, groups.subscribeResolve);

  app.get('/api/:token/groups/:groupId/files', authentication, groups.files);

  app.get('/api/:token/groups', authentication, groups.search, auth.groupsActions);
  app.get('/api/:token/groups', authentication, groups.search, auth.groupsActions);
  
  app.get('/api/:token/groups/:groupId/members', authentication, groups.members);

  app.post('/api/:token/groups/:groupId/messages', authentication, groups.messageToGroup);
  // GROUPS FORUMS

  app.post('/api/:token/groups/:groupId/forums', authentication, groups.createForum);

  app.post('/api/:token/groups/:groupId/forums/delete', authentication, groups.deleteForum);

  app.post('/api/:token/groups/:groupId/unsubscribe', authentication, groups.unsubscribe);

  app.post('/api/:token/groups/:groupId/forums/:forumId/messages', authentication, groups.messageToForum);

  app.get('/api/:token/groups/:groupId/forums/:forumId/messages', authentication, groups.messageFromForum, auth.messagesActions);

  app.post('/api/:token/groups/:groupId/forums/:forumId/messages/delete', authentication, groups.messageDelete);

  app.get('/api/:token/groups/:groupId/forums', authentication, groups.searchForum, auth.forumsActions);

  app.get('/app/download', function(req, res, next){
    res.render('download', {});
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
