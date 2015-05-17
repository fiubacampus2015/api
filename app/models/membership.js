var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var MemberShipSchema = new Schema({
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	status: { type:String, default: 'pending'},
	group:{ type: Schema.Types.ObjectId, ref: 'Group' },
});

mongoose.model('Membership', MemberShipSchema);