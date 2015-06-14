var mongoose = require('mongoose'),
  	Post = mongoose.model('Post'),
	winston = require('winston'), // log

  	Forum = mongoose.model('Forum'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var GroupSchema = new Schema({
	date: {type:Date, default: Date.now},
	photo: { type: String, default:'' },
	name: { type:String, default: ''},
	description: { type:String, default: ''},
	public: { type:Boolean, default: true},
	suspend: { type:Boolean, default: false},
	status: { type: String, default: 'public' },
	owner: { type: Schema.Types.ObjectId, ref:'User' },
	actions:[],
	members: { type:Number, default: 0},
	msgs: { type:Number, default: 0},
	request: { type:Number, default: 0}
});

GroupSchema.statics = {
	files: function (options,criteria, select, cb) {
		Forum.find({
			group: options._id
		})
		.select('_id')
		.exec(function(err, forums_id){
		  	if (err) cb(err, undefined);
		  	Post
		  	.find()
		  	.where('forum').in(forums_id)
		  	.populate("user")
		  	.populate({
		      path: 'message',
		      match: criteria,
		      select: select || '_id typeOf content',
		      options: { sort: 'date' }
		    })
		    .exec(function(err, posts) {

		    	if(err) cb(err, undefined);
		    	var messages = [];
		    	posts.forEach(function(post) {
		    		if(post.message) {
		    			post.message["user"] = post["user"];
		    			messages.push(post.message);
		    		}
		    	});
		    	cb(null, messages);
		    });
	  });
	},
	memberPlusPlus: function(id) {
		this.PlusDescreaseProperty(id, 'members', 1);
	},
	memberDecrease: function(id) {
		this.PlusDescreaseProperty(id, 'members', -1);
	},
	filePlusPlus: function(id) {
		this.PlusDescreaseProperty(id, 'files', 1);
	},
	fileDecrease: function(id) {
		this.PlusDescreaseProperty(id, 'files', -1);
		
	},
	msgsPlusPlus: function(id) {
		this.PlusDescreaseProperty(id, 'msgs', 1);
	},
	msgsDecrease: function(id) {
		this.PlusDescreaseProperty(id, 'msgs', -1);
	},
	requestPlusPlus: function(id) {
		this.PlusDescreaseProperty(id, 'request', 1);
		
	},
	requestDecrease: function(id) {
		this.PlusDescreaseProperty(id, 'request', -1);
	},
	PlusDescreaseProperty: function(id, property, factor) {
		this.findOne({
			_id: id
		}).exec(function(err, group){
			if(err || !group) return;
			group[property] = group[property] + (1 * factor);
			group.save(function(err){
				winston.info("FAIL SAVE USER", err);
			});
		})
	}
}



mongoose.model('Group', GroupSchema);
