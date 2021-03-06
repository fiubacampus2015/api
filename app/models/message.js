var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	typeOf: {type:String},
	date: {type:Date, default: Date.now},
  	content: { type: String, default: '' },
  	user: { type: Schema.Types.ObjectId, ref:'User' },
  	me: { type: Schema.Types.ObjectId, ref:'User' },
  	actions:[]
});

mongoose.model('Message', MessageSchema);
