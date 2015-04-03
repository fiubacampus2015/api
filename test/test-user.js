var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../app')
  , context = describe
  , User = mongoose.model('User')

var cookies, 
  count, 
  valid_token, 
  user_id;

describe('Users', function () {
  
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
        .expect(200)
        .expect(/Email cannot be blank/)
        .end(done)
      })

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/api/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
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

      it('should response 201', function (done) {
        request(app)
        .post('/api/users')
        .field('name', 'foobar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201)        
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
          user.email.should.equal('foobar@example.com')
          done()
        })
      })
    })
  });

  describe('POST /api/users/authenticate', function () {

      it('authenticate with invalid token should response ', function (done) {
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
        .field('username', 'foobar')
        .field('password', 'foobar')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if (!('token' in res.body)) return "no token";
          if (!('id' in res.body)) return "no id";
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
        })        
        .end(done)
      })
  });

  describe('PUT /apu/:token/users/:userId', function(){

      it('add user personal comments', function(done){
        request(app)
        .put('/api/' + valid_token + '/users/' + user_id + '/personal')
        .set('Content-Type', 'application/json')
        .send({
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
          if(res.body.personal.comments != "esto es un comentario") return "comments return not equals to request"
          if(res.body.personal.phones.mobile != "123") return "phones.mobile return not equals to request"
          if(res.body.personal.phones.other != "456") return "phones.other return not equals to request"
          if(res.body.personal.nacionality != "argentina") return "nacionality return not equals to request"
          if(res.body.personal.city != "buenos aires") return "city return not equals to request"
        })
        .end(done)
      });
  });

  after(function (done) {
    require('./helper').clearDb(done)
  })
})
