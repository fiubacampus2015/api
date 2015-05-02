var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  content: { type: String, default: '' },
  user: { type: Schema.Types.ObjectId, ref:'User' }
});

mongoose.model('Message', MessageSchema);
