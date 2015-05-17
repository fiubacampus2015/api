var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	date: {type:Date, default: Date.now},
	name: { type:String, default: ''},
	description: { type:String, default: ''},
	public: { type:Boolean, default: true},
	status: { type: String, default: '' },
	owner: { type: Schema.Types.ObjectId, ref:'User' }/*,
	members: {
		user: { type: Schema.Types.ObjectId, ref:'User' },
		status: { type: String, default: 'pending' }
	}*/
});

mongoose.model('Group', GroupSchema);
