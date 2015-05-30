var mongoose = require('mongoose'),
	async = require('async');

var crypto = require('crypto');
var Schema = mongoose.Schema;

var MemberShipSchema = new Schema({
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	status: { type:String, default: 'pending'},
	group:{ type: Schema.Types.ObjectId, ref: 'Group' },
	owner_name: { type:String}
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
		      return; // handle error
      		async.forEach(memberships, function (mp, callback) {
		      mp.group.populate('owner', function (err, result) {
		         callback();
		      });
		   	}, function (err) {
		      // forEach async completed
		      if(err)
		         return; // handle error
		      cb(memberships);
		   	});
	  });
	}
}

mongoose.model('Membership', MemberShipSchema);