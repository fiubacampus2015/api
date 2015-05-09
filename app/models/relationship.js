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
	},
	getPending: function(user_id, criteria, cb) {
		this.getOthers({
			  me:user_id,
			  status: 'pending',
			  type: 'friends'
			}, criteria, '_id name email personal', function(err, friends) {
				if (err) return cb(err);
				var response = [];
				friends.forEach(function(fri) {
					if(fri.other) response.push(fri.other);
				});

				cb(null, response);
		});
	},
	getPendingRelationShip: function(user_id, other_id, cb) {
		this.findOne({
			me: user_id,
			other:other_id,
			status: 'pending'
		}).exec(cb);
	},
	getFriendsId: function(user_id, cb) {
		this.getFriends(user_id, "_id", cb);
	}
}

mongoose.model('Relationship', RelationShipSchema);