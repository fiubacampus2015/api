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
	},
	getFriends: function(user_id, criteria, cb) {
		this.getOthers({
			  me:user_id,
			  status: 'ok',
			  type: 'friends'
			}, criteria, '_id name email personal', function(err, friends) {
				if (err) return cb(err);
				var response = [];
				friends.forEach(function(fri) {
					if(fri.other) response.push(fri.other);
				});

				cb(null, response);
		});
	}
}

mongoose.model('Relationship', RelationShipSchema);