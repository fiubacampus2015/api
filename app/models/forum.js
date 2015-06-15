var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var ForumSchema = new Schema({
	date: {type:Date, default: Date.now},
	last_activity: {type:Date, default: Date.now},
	group: { type: Schema.Types.ObjectId, ref:'Group' },
	title: {type:String, default: ''},
	owner: { type: Schema.Types.ObjectId, ref:'User' },
	actions:[],
	root: {type:Boolean, default: false},
	suspend: {type:Boolean, default: false},
  	posts: [{ type: Schema.Types.ObjectId, ref:'Post' }]
});

var PostSchema = new Schema({
	forum: { type: Schema.Types.ObjectId, ref:'Forum' },
	last_activity: {type:Date, default: Date.now},
	last_updated: { type: Number  },
	user: { type: Schema.Types.ObjectId, ref:'User' },
	date: { type:Date, default: Date.now },
	message: { type: Schema.Types.ObjectId, ref:'Message' }
});

ForumSchema.pre('save', function(next) {
  now = new Date();
  this.last_activity = now;
  return next();
});

PostSchema.pre('save', function(next) {
  if(!this.last_updated) {
  	now = new Date().getTime();
  	this.last_updated = now;	
  }
  return next();
});

mongoose.model('Forum', ForumSchema);

mongoose.model('Post', PostSchema);
