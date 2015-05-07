var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var RelationShipSchema = new Schema({
	me:{ type: Schema.Types.ObjectId, ref: 'User' },
	type: { type:String, default: 'friend'},
	status: { type:String, default: 'ok'},
	other:{ type: Schema.Types.ObjectId, ref: 'User' },
});


RelationShipSchema.statics = {
	getOthers: function (options, otheroptions, select, cb) {
		this.find(options)
		  .select('other')
		  .populate({
		    path:'other',
		    match: otheroptions,
		    select: select || '_id name email personal'
		  }).exec(cb);
	}
}

mongoose.model('Relationship', RelationShipSchema);