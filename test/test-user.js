var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../app')
  , context = describe
  , User = mongoose.model('User')
  , env = process.env.NODE_ENV || 'development';

var cookies, 
  count, 
  valid_token, 
  user_id,
  message_id,
  confirmation,
  group_id,
  forum_id,
  message_id,
  friend_id,
  friend_id_dos,
  friend_id_tres,
  subscribe_id;


describe('Users', function () {

  before(function (done) {
    //done()
     require('./helper').clearDb(done)
  }); 
  
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/api/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(400)
        .expect(/Email cannot be blank/)
        .end(done)
      })

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/api/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'alexispetalas@gmail.com')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(400)
        .expect(/Name cannot be blank/)
        .end(done)
      })

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('should response , with confirmation', function (done) {
        request(app)
        .post('/api/users')
        .field('name', 'foobar')
        .field('username', 'foobar')
        .field('email', 'foo@bar.com')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201)
        .expect(function(res){
          if (!('user' in res.body)) return "missing user";
          if (!('confirmation' in res.body)) return "missing confirmation";
          confirmation = res.body.confirmation;
          user_id = res.body.user._id
        })        
        .end(done)
      })

      

     it('should confirm a email', function (done) {
        request(app)
        .get('/api/users/' + user_id + "/confirm/" + confirmation)
        .expect('Content-Type', /html/)
        .expect(200)
        //.expect(/confirmed/)
        .end(done)
      })

     it('should error repeat mail', function (done) {
        request(app)
        .post('/api/users')
        .field('name', 'otrofoobar')
        .field('username', 'otrofoobar')
        .field('email', 'foo@bar.com')
        .field('password', 'otrofoobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(400)
        .expect(function(res){
          if (!('errors' in res.body)) return "missing errors";
        })        
        .end(done)
      })

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done()
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.email.should.equal('foo@bar.com')
          done()
        })
      })
    })
  });

  describe('POST /api/users/authenticate', function () {

      it('authenticate with invalid token should response', function (done) {
        request(app)
        .post('/api/users/authenticate')
        .field('username', '')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if (!('errors' in res.body)) return "missing errors";

        })
        .expect(401)
        .end(done)
      })

      it('should have a record in to the database', function (done) {
        User.find({},function (err, users) {
          done()
        })
      })


      it('authenticate ok', function (done) {
        request(app)
        .post('/api/users/authenticate')
        .field('email', 'foo@bar.com')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if (!('token' in res.body)) return "no token";
          if (!('id' in res.body)) return "no id";
          if (!('confirmed' in res.body)) return "no confirmed";
          console.log("token:", res.body.token);
          valid_token = res.body.token;
          console.log("user_id:", res.body.id);
          user_id = res.body.id;
        })
        .expect(200)
        .end(done)
      })
  });

  describe('GET /api/:token/users/:userId', function () {

      it('get with invalid token', function (done) {
        request(app)
        .get('/api/' + valid_token + '/users/' + user_id)
        .expect(200)
        .expect(function(res){
          if (!('_id' in res.body)) return "no _id";
          if(res.body._id != user_id) return "no equals id";
        })        
        .end(done)
      })
  });

  describe('PUT /apu/:token/users/:userId', function(){

      it('add user personal comments', function(done){
        request(app)
        .put('/api/' + valid_token + '/users/' + user_id)
        .set('Content-Type', 'application/json')
        .send({
          name: "otro",
          personal: {
            comments: "esto es un comentario",
            phones: {
              mobile: "123",
              other: "456"
            },
            nacionality: "argentina",
            city: "buenos aires"
          }          
        })        
        .expect(200)
        .expect(function(res){
          if (!('personal' in res.body)) return "no return";
          if(res.body.name != "otro") return "name no change"
          if(res.body.personal.comments != "esto es un comentario") return "comments return not equals to request"
          if(res.body.personal.phones.mobile != "123") return "phones.mobile return not equals to request"
          if(res.body.personal.phones.other != "456") return "phones.other return not equals to request"
          if(res.body.personal.nacionality != "argentina") return "nacionality return not equals to request"
          if(res.body.personal.city != "buenos aires") return "city return not equals to request"
        })
        .end(done)
      });
      
      it('add user jobs info', function(done){
        request(app)
        .put('/api/' + valid_token + '/users/' + user_id)
        .set('Content-Type', 'application/json')
        .send({
          job:{
            companies:[{
              initdate: new Date(),
              enddate: new Date(),
              place: 'aca'
            }]
          },
        })        
        .expect(200)
        .expect(function(res){
          if (!('job' in res.body)) return "no return";          
          if (!res.body.job.companies.length == 1) return "no jobs return";
        })
        .end(done)
      });

      it('add user education info', function(done){
        request(app)
        .put('/api/' + valid_token + '/users/' + user_id)
        .set('Content-Type', 'application/json')
        .send({
          education:{
             careers:[{
              title: 'ing.',
              branch: 'gestion',  
              initdate: new Date
            }]
          }
        })        
        .expect(200)
        .expect(function(res){
          if (!('education' in res.body)) return "no return";     
          if (!res.body.education.careers.length == 1) return "no education return"; 
        })
        .end(done)
      });
  });

  
  describe('GET friends', function(){
    
    before(function (done) {
        // guardo un amigo para relacionarme
        var friend = new User({name:'pepe', email:'pepelo', username:'foo', password: 'bar', personal: {
            comments: "esto es un comentario",
            phones: {
              mobile: "123",
              other: "456"
            },
            nacionality: "argentina",
            city: "buenos aires"
          }});

        friend.save(function(err){
          friend_id = friend._id;
          var frienddos = new User({name:'andres', email:'andrelo', username:'foo', password: 'bar', education:{
             careers:[{
              title: 'ing.',
              branch: 'gestion',  
              initdate: new Date
            }]
          }});
          frienddos.save(function(err){
            friend_id_dos = frienddos._id;
            var friendtres = new User({name:'paparulo', email:'paparulo', username:'foo', password: 'bar'});
            friendtres.save(function(err){
              friend_id_tres = friendtres._id;
              done();
            });
          });
        });        
    });

    it('be my friend', function(done){
      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id);

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res){
        })
        .end(done)
    });  


    it('you confirm me ', function(done){

      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id + '/confirm');

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res) {
        })
        .end(done)
    });

    it('you be my friend too ', function(done){
      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id_dos);

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res){
        })
        .end(done)

    });

    it('you be my friend too repeat error', function(done){
      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id_dos);

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res){
          if(res.body.status != 400) return "no ERROR!!"
        })
        .end(done)

    });

    it('you be my friend too tres', function(done){
      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id_tres);

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res){
        })
        .end(done)

    });

     it('tres reject me ', function(done){

      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/' + friend_id_tres + '/reject');

      request(app)
        .put(url)
        .expect(200)
        .expect(function(res) {
        })
        .end(done)
    });

    
    it('test search friends by name status ok', function(done){
      
      var url = '/api/'
        .concat(valid_token)
        .concat('/users/' + user_id + '/friends?name=pepe');

      request(app)
        .get(url)
        .expect(200)
        .expect(function(res){
          if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
        })
        .end(done) 
    });

    it('test search friends by name status pending not result', function(done) {

      var url = '/api/'
        .concat(valid_token)
        .concat('/users/' + user_id + '/friends?name=andres');

      request(app)
        .get(url)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect(function(res){
          if(!res.body || typeof(res.body) !== 'object' || res.body.length > 0) return "result for friend pending"
        })
        .end(done)
      });

      it('test search friends by name status pending', function(done) {
        var url = '/api/'
          .concat(valid_token)
          .concat('/users/' + friend_id_dos + '/friends/pending');

        request(app)
          .get(url)
          .set('Content-Type', 'application/json')
          .expect(200)
          .expect(function(res){
            if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
          })
          .end(done)
      });

      it('should delete a relationship', function(done) {
        var url = '/api/'
          .concat(valid_token)
          .concat('/users/' + user_id + '/' + friend_id + '/delete');

        request(app)
          .post(url)
          .set('Content-Type', 'application/json')
          .expect(200)
          .expect(function(res){
            
          })
          .end(done)
      });

      it('test search delete friends by name', function(done) {

        var url = '/api/'
        .concat(valid_token)
        .concat('/users/' + user_id + '/friends?name=pepe');

      request(app)
        .get(url)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect(function(res){
          if(res.body.length > 0) return "result!!!"
        })
        .end(done)

      });
  });

  var doRequest = function (query, done) {

    var url = '/api/'
      .concat(valid_token)
      .concat(query);

    request(app)
      .get(url)
      .expect(200)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
  };

  describe('POST /api/:token/users/userId/wall', function(){

    it('write add message into friends wall', function(done) {
      request(app)
      .post('/api/' + valid_token + '/users/' + user_id +'/wall')
      .set('Content-Type', 'application/json')
      .send({
        content: "hola capo 1",
        typeOf:'post'
      })
      .expect(201)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

    it('write add message into friends wall', function(done) {
      request(app)
      .post('/api/' + valid_token + '/users/' + user_id +'/wall')
      .set('Content-Type', 'application/json')
      .send({
        content: "hola capo 2",
        typeOf:'post'
      })
      .expect(201)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

    it('write other message into friends wall', function(done) {
      request(app)
      .post('/api/' + valid_token + '/users/' + user_id +'/wall')
      .set('Content-Type', 'application/json')
      .send({
        content: "hola capo 3",
        typeOf:'post'
      })
      .expect(201)
      .expect(function(res){
        //console.log(res.body)
        message_id = res.body._id
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

    it('delete message into friends wall', function(done) {
      request(app)
      .post('/api/' + valid_token + '/users/' + user_id +'/walldelete')
      .set('Content-Type', 'application/json')
      .send({
        _id: message_id
      })
      .expect(200)
      .expect(function(res){
      })
      .end(done)
    });

    it('GET friends wall', function(done) {
      request(app)
      .get('/api/' + valid_token + '/users/' + user_id +'/wall')
      .expect(200)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });
  });

  describe('GET people with friends', function(done) {
    it('get people order by friends', function(done) {
      request(app)
      .get('/api/' + valid_token + '/people')
      .expect(200)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
        if(res.body[0].friend == false) return "no amigos primero!"
      })
      .end(done)
    });
  });

  describe('GET /api/:token/people', function(){

    it('test search people by name', function(done){
      doRequest('/people?name=pepe', done);
    });

    it('test search people by city', function(done){
      doRequest('/people?personal.city=buenos', done);
    });

    it('test search people by email', function(done){
      doRequest('/people?email=paparulo', done);
    });

    it('test search people by phone', function(done){
      doRequest('/people?personal.phones.mobile=123', done);
    });

    it('test search people by education', function(done){
      doRequest('/people?education.careers.title=ing', done);
    });

    it('should get people paginate', function(done){
      doRequest('/people?name=p&limit=10&page=0', done);
    });

  });

  describe('GROUPS', function(){

    it('should create a group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups')
      .send({
        owner: {_id:user_id},
        name:'un grupo copado',
        description: 'un grupo para poder hablar de cosas copadas ja'        
      })
      .expect(201)
      .expect(function(res){
        group_id = res.body._id;
      })
      .end(done)


    });

    it('should create another group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups')
      .send({
        owner: {_id:user_id},
        name:'a pero que grupo copado he',
        description: 'otro grupo que la rompe'        
      })
      .expect(201)
      .expect(function(res){
        
      })
      .end(done)

      
    });

    
     it('should create a groups forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums')
      .send({
        title:'esto es un foro para discutir cosas generales del grupo',
        message: {
          content: "esto es un post a groups",
          typeOf: 'forum'
        }
      })
      .expect(201)
      .expect(function(res) {
        forum_id = res.body._id;
      })
      .end(done)
    });

     it('should create another groups forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums')
      .send({
        title:'a que no sabes que titulo tiene mi foro de temas generales',
        message: {
          content: "esto es otro post a groups",
          typeOf: 'forum'
        }
      })
      .expect(201)
      .expect(function(res) {
        
      })
      .end(done)
    });

    it('should subscribe a group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/subscribe')
      .send({
        _id: user_id
      })
      .expect(201)
      .expect(function(res) {
        //console.log("subscription", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
        subscribe_id = res.body._id;
        //console.log("subscribe_id: ", subscribe_id)
      })
      .end(done)
    });

    it('should resolve a subscription', function(done){
      request(app)
      .put('/api/' + valid_token + '/groups/' + group_id + '/subscribe/' + subscribe_id + '/resolve')
      .send({
        status: "accepted"
      })
      .expect(200)
      .expect(function(res) {
        //console.log(res.body)
        //console.log("subscription", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
        
      })
      .end(done)
    });

    it('should post a message forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums/' + forum_id + '/messages')
      .send({
          content: "esto es un post a groups",
          typeOf: 'forum'
      })
      .expect(201)
      .expect(function(res) {
        message_id = res.body._id;
      })
      .end(done)
    });

    it('should post a message forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums/' + forum_id + '/messages')
      .send({
          content: "Archivo.txt",
          typeOf: 'file'
      })
      .expect(201)
      .expect(function(res) {
      })
      .end(done)
    });

    it('should post a message group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id  + '/messages')
      .send({
          content: "VAMO.txt",
          typeOf: 'file'
      })
      .expect(201)
      .expect(function(res) {
      })
      .end(done)
    });

    it('should get groups files', function(done){
      request(app)
      .get('/api/' + valid_token + '/groups/' + group_id + '/files')
      .expect(200)
      .expect(function(res) {
        console.log("MESSAGES", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });



    it('should get a posts forum', function(done){
      request(app)
      .get('/api/' + valid_token + '/groups/' + group_id + '/forums/' + forum_id + '/messages?limit=10&page=0')
      .expect(200)
      .expect(function(res) {
        //console.log("MESSAGES", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"

      })
      .end(done)
    });

    it('should delete a posts forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums/' + forum_id + '/messages/delete')
      .send({
        _id: message_id
      })
      .expect(200)
      .expect(function(res) {
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

    
    
   

  it('should change a group', function(done){
      request(app)
      .put('/api/' + valid_token + '/groups/' + group_id)
      .send({
        name: "mejor otro nombre copado",
        description: "mejor otra description copado"
      })
      .expect(200)
      .expect(function(res) {        
      })
      .end(done)
    });


    it('should search a groups forum', function(done){
      request(app)
      .get('/api/' + valid_token + '/groups/' + group_id + '/forums?title=GENERALES&limit=2&page=0')
      .expect(200)
      .expect(function(res) {
        //console.log("", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

    it('should get my groups and subscribed groups', function(done){
      
      console.log('/api/' + valid_token + '/users/' + user_id + '/groups')
      request(app)
      .get('/api/' + valid_token + '/users/' + user_id + '/groups')
      .expect(200)
      .expect(function(res) {
        console.log(res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    })

    it('should get members', function(done){
      request(app)
      .get('/api/' + valid_token + '/groups/' + group_id + '/members')
      .expect(200)
      .expect(function(res) {
        //console.log(res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });



    it('should unsubscribe a group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/unsubscribe')
      .send({
        
          _id: friend_id_dos 
        
      })
      .expect(200)
      .expect(function(res) {
        //console.log("subscription", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });

     it('should search a group', function(done){
      request(app)
      .get('/api/' + valid_token + '/groups?name=copado&limit=2&page=0')
      .expect(200)
      .expect(function(res) {

        //console.log("groups: ", res.body)
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
      })
      .end(done)
    });


    it('should delete a forum', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/' + group_id + '/forums/delete')
      .send({
        _id: forum_id
      })
      .expect(200)
      .expect(function(res) {        
      })
      .end(done)
    });

    it('should delete a group', function(done){
      request(app)
      .post('/api/' + valid_token + '/groups/delete')
      .send({
        _id: group_id
      })
      .expect(200)
      .expect(function(res) {        
      })
      .end(done)
    });

  });

  describe('positions', function(done){
    it('should post a position', function(done){
      request(app)
      .post('/api/' + valid_token + '/users/' + user_id + "/position")
      .send({
        position: "12312:2312312"
      })
      .expect(201)
      .expect(function(res) {
        //console.log(res.body)
      })
      .end(done)
    });
  });

  after(function (done) {
      done()
     require('./helper').clearDb(done)
  }); 
})
