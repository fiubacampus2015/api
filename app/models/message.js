var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	typeOf: {type:String},
	date: {type:Date},
  	content: { type: String, default: '' },
  	userTo: { type: Schema.Types.ObjectId, ref:'User' },
  	userFrom: { type: Schema.Types.ObjectId, ref:'User' }
});

mongoose.model('Message', MessageSchema);
