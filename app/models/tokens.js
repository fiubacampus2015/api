var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
	_user:{ type: Schema.Types.ObjectId, ref:'User' },
	value: { type:String, required: true,  unique: true},
	modified: { type: Date, default: Date.now }
});

mongoose.model('Token', TokenSchema);