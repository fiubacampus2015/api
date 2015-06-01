var express = require('express');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan'); // log http request
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf'); // token
var multer = require('multer'); // multipart (upload files)
var swig = require('swig'); // template engine

var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash'); // mensajes asociados a la session.
var winston = require('winston'); // log
var helpers = require('view-helpers'); // helper method for views
var config = require('./config');
var pkg = require('../package.json');

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {

  // middleware de compresion, debe ser declarado antes que express.static
  app.use(compression({
    threshold: 512
  }));
  app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb'}));

  // middleware de archivos estaticos de express
  app.use(express.static(config.root + '/public'));

  // en produccion usamos winston como loguer
  var log;
  if (env !== 'development') {
    log = {
      stream: {
        write: function (message, encoding) {
          winston.info(message);
        }
      }
    };
  } else {
    log = 'dev';
  }

  // En test no loguamos
  if (env !== 'test') app.use(morgan(log));

  // Swig templating engine settings
  if (env === 'development' || env === 'test') {
    swig.setDefaults({
      cache: false
    });
  }
  
  // set views path, template engine and default layout
  app.engine('html', swig.renderFile);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');

  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer());
  app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // CookieParser should be above session
  app.use(cookieParser());
  //app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      url: config.db,
      collection : 'sessions'
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());
  // connect flash for flash messages - should be declared after sessions
  app.use(flash());

  // should be declared after session and flash
  app.use(helpers(pkg.name));

  // adds CSRF support
  /*
  if (process.env.NODE_ENV !== 'test') {
    app.use(csrf());

    // This could be moved to view-helpers :-)
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      next();
    });
  }*/
};