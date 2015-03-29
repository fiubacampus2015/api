var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var AlumnoSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' }
});

mongoose.model('Alumno', AlumnoSchema);
