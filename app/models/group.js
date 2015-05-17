var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	date: {type:Date, default: Date.now},
	name: { type:String, default: ''},
	description: { type:String, default: ''},
  	status: { type: String, default: '' },
  	owner: { type: Schema.Types.ObjectId, ref:'User' }
});

mongoose.model('Group', GroupSchema);
