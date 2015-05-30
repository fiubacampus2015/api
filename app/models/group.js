var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	date: {type:Date, default: Date.now},
	photo: { type: String, default:'' },
	name: { type:String, default: ''},
	description: { type:String, default: ''},
	public: { type:Boolean, default: true},
	status: { type: String, default: 'public' },
	owner: { type: Schema.Types.ObjectId, ref:'User' },
	actions:[],
	members: { type:Number, default: 0},
	request: { type:Number, default: 0}
});

mongoose.model('Group', GroupSchema);
