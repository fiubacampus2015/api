var mongoose = require('mongoose'),
  	Post = mongoose.model('Post'),
  	Forum = mongoose.model('Forum'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

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

GroupSchema.statics = {
	files: function (options, select, cb) {
		Forum.find({
			group: options._id
		})
		.select('_id')
		.exec(function(err, forums_id){
		  	if (err) cb(err, undefined);;
		  	Post
		  	.find()
		  	.where('forum').in(forums_id)
		  	.populate({
		      path: 'message',
		      match: {
		      	 'typeOf': { $in: ['photo','video', 'file'] } 
		      },
		      select: select || '_id typeOf content',
		      options: { sort: 'date' }
		    }).exec(function(err, posts) {
		    	if(err) cb(err, undefined);
		    	var messages = [];
		    	posts.forEach(function(post) {
		    		if(post.message)
		    			messages.push(post.message)
		    	});
		    	cb(null, messages);
		    });
	  });
	}
}



mongoose.model('Group', GroupSchema);
