var mongoose = require('mongoose'),
	async = require('async');

var crypto = require('crypto');
var Schema = mongoose.Schema;

var MemberShipSchema = new Schema({
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	status: { type:String, default: 'pending'},
	group:{ type: Schema.Types.ObjectId, ref: 'Group' }
});

MemberShipSchema.statics = {
	getGroups: function (options, groupOptions, select, limit, page, cb) {
		this.find(options)
		  .select('group status owner_name')
		  .limit(limit)
		  .skip(limit * page)
		  .populate({
		    path:'group',
		    match: groupOptions,
		    select: select
		  }).exec(function(err, memberships){
		  	if (err)
		      return cb(err, undefined)
      		async.forEach(memberships, function (mp, callback) {
      			if(mp.group && mp.group._id) {
      				mp.group.populate('owner', function (err, result) {
		 				callback();
					});	
      			} else
      			 	callback();
				
		   	}, function (err) {
		      if(err) cb(err, undefined);
		      cb(null, memberships);
		   	});
	  });
	}
}

mongoose.model('Membership', MemberShipSchema);