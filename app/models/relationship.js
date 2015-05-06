var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var RelationShipSchema = new Schema({
	me:{ type: Schema.Types.ObjectId, ref:'User' },
	type: { type:String, required: true},
	status: { type:String, required: true},
	other:{ type: Schema.Types.ObjectId, ref:'User' },
});

mongoose.model('Relationship', RelationShipSchema);