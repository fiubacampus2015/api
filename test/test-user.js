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
  confirmation;

describe('Users', function () {

  before(function (done) {
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
        .expect(/confirmed/)
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
          valid_token = res.body.token;
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
          },
        })        
        .expect(200)
        .expect(function(res){
          if (!('education' in res.body)) return "no return";     
          if (!res.body.education.careers.length == 1) return "no education return"; 
        })
        .end(done)
      });
  });

  describe('GET /api/:token/people', function(){

    it('test search people by name', function(done){
      doRequest('/people?name=otro', done);
    });

    it('test search people by city', function(done){
      doRequest('/people?personal.city=buenos', done);
    });

    it('test search people by email', function(done){
      doRequest('/people?email=foo@bar.com', done);
    });

    it('test search people by phone', function(done){
      doRequest('/people?personal.phones.mobile=123', done);
    });

    it('test search people by education', function(done){
      doRequest('/people?education.careers.title=ing', done);
    });

  });

  describe('GET friends', function(){
    before(function (done) {
        var friend = new User({name:'pepe', email:'asdasd', username:'asdasd', password: 'asdasd'})
        var frienddos = new User({name:'andres', email:'hjkhji', username:'ghjghj', password: 'ghjghj'})
        frienddos.save(function(err){
          friend.save(function(err){
            User.findOne({_id: user_id }, function(err, user) {
              user.contacts.push({
                status: 'ok',
                user: friend
              })
              user.contacts.push({
                status: 'pending',
                user: frienddos
              })
              user.save(function(err){
                done();
              })
            });  
          });
        });
    });

    it('test search friends by name status ok', function(done){
      doRequest('/users/' + user_id + '/friends?name=pepe', done);
    });

    it('test search friends by name status pending not result', function(done) {

      var url = '/api/'
      .concat(valid_token)
      .concat('/users/' + user_id + '/friends?name=andres');

    request(app)
      .get(url)
      .expect(200)
      .expect(function(res){
        console.log(res.body)          
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
        content: "hola capo"        
      })
      .expect(201)
      .expect(function(res){
        if(!res.body || typeof(res.body) !== 'object' || res.body.length == 0) return "no result!"
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

  after(function (done) {
     require('./helper').clearDb(done)
  }); 
})
